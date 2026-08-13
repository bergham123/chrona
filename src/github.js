// src/github.js
function ghHeaders(env) {
  return {
    Authorization: "Bearer " + env.GITHUB_TOKEN,
    "User-Agent": "chrona-worker",
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };
}

function utf8ToBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function base64ToUtf8(b64) {
  return decodeURIComponent(escape(atob(b64.replace(/\n/g, ""))));
}

async function fetchWithRetry(url, options, retries = 3, delay = 500) {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url, options);
    if (res.ok || res.status === 404) return res;
    if (i === retries - 1) throw new Error(`GitHub API error ${res.status}: ${await res.text()}`);
    await new Promise(r => setTimeout(r, delay * (i + 1)));
  }
}

export async function githubGetFile(env, path) {
  const branch = env.GITHUB_BRANCH || "main";
  const url =
    "https://api.github.com/repos/" +
    env.GITHUB_OWNER +
    "/" +
    env.GITHUB_REPO +
    "/contents/" +
    encodeURIComponent(path) +
    "?ref=" +
    branch;
  const res = await fetchWithRetry(url, { headers: ghHeaders(env) });
  if (res.status === 404) return { content: null, sha: null, exists: false };
  if (!res.ok) throw new Error("GitHub GET error " + res.status);
  const data = await res.json();
  return { content: base64ToUtf8(data.content), sha: data.sha, exists: true };
}

export async function githubPutFile(env, path, contentStr, sha, message) {
  const branch = env.GITHUB_BRANCH || "main";
  const url =
    "https://api.github.com/repos/" +
    env.GITHUB_OWNER +
    "/" +
    env.GITHUB_REPO +
    "/contents/" +
    encodeURIComponent(path);
  const body = {
    message: message || "Update " + path,
    content: utf8ToBase64(contentStr),
    branch: branch,
  };
  if (sha) body.sha = sha;
  const res = await fetchWithRetry(url, {
    method: "PUT",
    headers: ghHeaders(env),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("GitHub PUT error " + res.status);
  return await res.json();
}

export async function githubDeleteFile(env, path, sha, message) {
  const branch = env.GITHUB_BRANCH || "main";
  const url =
    "https://api.github.com/repos/" +
    env.GITHUB_OWNER +
    "/" +
    env.GITHUB_REPO +
    "/contents/" +
    encodeURIComponent(path);
  const body = {
    message: message || "Delete " + path,
    sha: sha,
    branch: branch,
  };
  const res = await fetchWithRetry(url, {
    method: "DELETE",
    headers: ghHeaders(env),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("GitHub DELETE error " + res.status);
  return await res.json();
}

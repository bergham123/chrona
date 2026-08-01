// ================================================================
// دوال مساعدة للتعامل مع GitHub API
// ================================================================

export function ghHeaders(env) {
  return {
    Authorization: "Bearer " + env.GITHUB_TOKEN,
    "User-Agent": "chrona-worker",
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };
}

export function utf8ToBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

export function base64ToUtf8(b64) {
  return decodeURIComponent(escape(atob(b64.replace(/\n/g, ""))));
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
  const res = await fetch(url, { headers: ghHeaders(env) });
  if (res.status === 404) return { content: null, sha: null, exists: false };
  if (!res.ok) throw new Error("GitHub GET error " + res.status + ": " + (await res.text()));
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
  const res = await fetch(url, {
    method: "PUT",
    headers: ghHeaders(env),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("GitHub PUT error " + res.status + ": " + (await res.text()));
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
  const res = await fetch(url, {
    method: "DELETE",
    headers: ghHeaders(env),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("GitHub DELETE error " + res.status + ": " + (await res.text()));
  return await res.json();
}

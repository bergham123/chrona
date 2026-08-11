// ================================================================
// src/helpers.js
// ================================================================

export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Username",
    },
  });
}

export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyPassword(password, hash) {
  const hashed = await hashPassword(password);
  return hashed === hash;
}

export function generateId() {
  return crypto.randomUUID();
}

export function getToday() {
  return new Date().toISOString().split("T")[0];
}

// Validate inputs
export function validateUsername(username) {
  if (!username || typeof username !== "string") return "Username is required";
  if (username.length < 3) return "Username must be at least 3 characters";
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Username contains invalid characters";
  return null;
}

export function validatePassword(password) {
  if (!password || typeof password !== "string") return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return null;
}

export function validateEmail(email) {
  if (!email || typeof email !== "string") return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format";
  return null;
}

export function validateEventTitle(title) {
  if (!title || typeof title !== "string") return "Event title is required";
  if (title.trim().length === 0) return "Event title cannot be empty";
  return null;
}

// Verification & Telegram
export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function storeVerificationCode(env, username, code) {
  await env.VERIFICATION_KV.put(`code:${username}`, code, { expirationTtl: 600 });
}

export async function getVerificationCode(env, username) {
  return await env.VERIFICATION_KV.get(`code:${username}`);
}

export async function deleteVerificationCode(env, username) {
  await env.VERIFICATION_KV.delete(`code:${username}`);
}

export async function sendTelegramMessage(env, chatId, text) {
  const token = env.TELEGRAM_BOT_TOKEN;
  if (!token) return;
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

// Migrate old task format to new event format if needed
export function migrateEvent(oldTask) {
  if (oldTask.start && !oldTask.time) return oldTask;
  return {
    id: oldTask.id || generateId(),
    title: oldTask.title || "Untitled",
    date: oldTask.date || getToday(),
    start: oldTask.time || oldTask.start || "09:00",
    end: oldTask.endTime || oldTask.end || "10:00",
    calendar: oldTask.calendar || oldTask.type || "work",
    location: oldTask.location || "",
    notes: oldTask.notes || "",
    guests: oldTask.guests || "",
    recurrence: oldTask.recurrence || "none",
    description: oldTask.description || "",
    alert: oldTask.alert || "now",
    notifyVia: oldTask.notifyVia || [],
    color: oldTask.color || null,
    type: oldTask.type || oldTask.calendar || "work",
    status: oldTask.status || "pending",
    createdAt: oldTask.createdAt || new Date().toISOString(),
    updatedAt: oldTask.updatedAt || new Date().toISOString(),
  };
}

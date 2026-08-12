// ================================================================
// src/helpers.js - Utilities & Validators
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

// ================================================================
// Password Management
// ================================================================

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

// ================================================================
// ID & Date Utilities
// ================================================================

export function generateId() {
  return crypto.randomUUID();
}

export function getToday() {
  return new Date().toISOString().split("T")[0];
}

// ================================================================
// Input Validation (Server-side)
// ================================================================

export function validateUsername(username) {
  if (!username || typeof username !== "string") {
    return "Username is required";
  }
  if (username.length < 3) {
    return "Username must be at least 3 characters";
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return "Username can only contain letters, numbers, and underscores";
  }
  return null;
}

export function validatePassword(password) {
  if (!password || typeof password !== "string") {
    return "Password is required";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }
  return null;
}

export function validateEmail(email) {
  if (!email || typeof email !== "string") {
    return "Email is required";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Invalid email format";
  }
  return null;
}

export function validateTelegramId(telegramId) {
  if (!telegramId) {
    return null; // اختياري
  }
  if (!/^\d{6,12}$/.test(telegramId.toString())) {
    return "Telegram ID must be numeric (6-12 digits)";
  }
  return null;
}

export function validatePhoneNumber(phone) {
  if (!phone) {
    return null; // اختياري
  }
  if (!/^\+?[\d\s\-()]{10,}$/.test(phone)) {
    return "Invalid phone number format";
  }
  return null;
}

export function validateEventTitle(title) {
  if (!title || typeof title !== "string") {
    return "Event title is required";
  }
  if (title.trim().length === 0) {
    return "Event title cannot be empty";
  }
  if (title.trim().length > 200) {
    return "Event title must be less than 200 characters";
  }
  return null;
}

export function validateDateFormat(date) {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return "Invalid date format. Use YYYY-MM-DD";
  }
  // تحقق من أن التاريخ صحيح
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return "Invalid date";
    }
  } catch {
    return "Invalid date";
  }
  return null;
}

// ================================================================
// Telegram Notification (بسيط - بدون verification)
// ================================================================

export async function sendTelegramMessage(env, chatId, text) {
  if (!env.TELEGRAM_BOT_TOKEN || !chatId) {
    console.warn("⚠️ Telegram not configured or chatId missing");
    return { success: false, reason: "Telegram not configured" };
  }

  try {
    const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      console.error("❌ Telegram API error:", response.status);
      return { success: false, reason: `API error: ${response.status}` };
    }

    return { success: true };
  } catch (error) {
    console.error("❌ Telegram send error:", error);
    return { success: false, reason: error.message };
  }
}

// ================================================================
// Event Migration (من الصيغة القديمة إلى الجديدة)
// ================================================================

export function migrateEvent(oldTask) {
  // إذا كان الحدث بالصيغة الجديدة بالفعل
  if (oldTask.start && !oldTask.time) {
    return oldTask;
  }

  // تحويل الصيغة القديمة
  return {
    id: oldTask.id || generateId(),
    title: oldTask.title || "Untitled",
    description: oldTask.description || "",
    date: oldTask.date || getToday(),
    start: oldTask.time || oldTask.start || "09:00",
    end: oldTask.endTime || oldTask.end || "10:00",
    calendar: oldTask.calendar || oldTask.type || "work",
    location: oldTask.location || "",
    notes: oldTask.notes || "",
    guests: oldTask.guests || "",
    recurrence: oldTask.recurrence || "none",
    alert: oldTask.alert || "now",
    notifyVia: oldTask.notifyVia || [],
    color: oldTask.color || null,
    type: oldTask.type || oldTask.calendar || "work",
    status: oldTask.status || "pending",
    createdAt: oldTask.createdAt || new Date().toISOString(),
    updatedAt: oldTask.updatedAt || new Date().toISOString(),
  };
}

// ================================================================
// Password Reset Helper (بديل عن Telegram verification)
// ================================================================

export async function storePasswordResetCode(env, username, code) {
  await env.VERIFICATION_KV.put(`reset:${username}`, code, {
    expirationTtl: 900, // 15 دقيقة
  });
}

export async function getPasswordResetCode(env, username) {
  return await env.VERIFICATION_KV.get(`reset:${username}`);
}

export async function deletePasswordResetCode(env, username) {
  await env.VERIFICATION_KV.delete(`reset:${username}`);
}

// ================================================================
// Utility: XSS Prevention
// ================================================================

export function escapeHtml(text) {
  if (!text) return "";
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

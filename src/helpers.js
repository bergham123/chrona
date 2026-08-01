// ================================================================
// دوال مساعدة عامة
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

// تحويل تاريخ YYYY-MM-DD إلى DD-MM-YY
export function formatDateToDDMMYY(dateStr) {
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}-${parts[1]}-${parts[0].slice(-2)}`;
}

// العكس: من DD-MM-YY إلى YYYY-MM-DD (للفهرسة)
export function parseDDMMYYtoYYYYMMDD(dateStr) {
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  return `20${parts[2]}-${parts[1]}-${parts[0]}`;
}

export function getToday() {
  return new Date().toISOString().split("T")[0];
}

// دوال التحقق
export function validateUsername(username) {
  if (!username || typeof username !== "string") return "اسم المستخدم مطلوب";
  if (username.length < 3) return "اسم المستخدم يجب أن يكون 3 أحرف على الأقل";
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return "اسم المستخدم يحتوي على أحرف غير مسموحة";
  return null;
}

export function validatePassword(password) {
  if (!password || typeof password !== "string") return "كلمة المرور مطلوبة";
  if (password.length < 6) return "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
  return null;
}

export function validateTaskTitle(title) {
  if (!title || typeof title !== "string") return "عنوان المهمة مطلوب";
  if (title.trim().length === 0) return "عنوان المهمة لا يمكن أن يكون فارغاً";
  return null;
}

// توليد رمز تحقق
export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// تخزين الرمز في KV
export async function storeVerificationCode(env, username, code) {
  await env.VERIFICATION_KV.put(`code:${username}`, code, { expirationTtl: 600 });
}

export async function getVerificationCode(env, username) {
  return await env.VERIFICATION_KV.get(`code:${username}`);
}

export async function deleteVerificationCode(env, username) {
  await env.VERIFICATION_KV.delete(`code:${username}`);
}

// ================================================================
// src/handlers.js - Business Logic & API Handlers
// ================================================================

import { githubGetFile, githubPutFile, githubDeleteFile } from "./github.js";
import {
  jsonResponse,
  hashPassword,
  verifyPassword,
  generateId,
  getToday,
  validateUsername,
  validatePassword,
  validateEmail,
  validateTelegramId,
  validatePhoneNumber,
  validateEventTitle,
  validateDateFormat,
  sendTelegramMessage,
  migrateEvent,
  storePasswordResetCode,
  getPasswordResetCode,
  deletePasswordResetCode,
} from "./helpers.js";

// ================================================================
// Data Access Layer (GitHub)
// ================================================================

async function getAllUsers(env) {
  const { content, exists } = await githubGetFile(env, "users/allusers.json");
  if (!exists || !content) return {};
  try {
    return JSON.parse(content);
  } catch {
    return {};
  }
}

async function saveAllUsers(env, users) {
  const { sha } = await githubGetFile(env, "users/allusers.json");
  await githubPutFile(
    env,
    "users/allusers.json",
    JSON.stringify(users, null, 2),
    sha,
    "Update users list"
  );
}

async function getUserDashboard(env, username) {
  const path = `dash-users/${username}.json`;
  const { content, exists } = await githubGetFile(env, path);
  if (!exists || !content) return null;
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}

async function saveUserDashboard(env, username, dashboard) {
  const path = `dash-users/${username}.json`;
  const { sha } = await githubGetFile(env, path);
  await githubPutFile(
    env,
    path,
    JSON.stringify(dashboard, null, 2),
    sha,
    `Update dashboard ${username}`
  );
}

async function getJobsForDate(env, date) {
  const path = `jobs/${date}.json`;
  const { content, exists } = await githubGetFile(env, path);
  if (!exists || !content) return [];
  try {
    return JSON.parse(content);
  } catch {
    return [];
  }
}

async function saveJobsForDate(env, date, events) {
  const path = `jobs/${date}.json`;
  const { sha } = await githubGetFile(env, path);
  await githubPutFile(
    env,
    path,
    JSON.stringify(events, null, 2),
    sha,
    `Update jobs ${date}`
  );
}

export async function getAllUsers(env) {
  const { content, exists } = await githubGetFile(env, "users/allusers.json");
  if (!exists || !content) return {};
  try {
    return JSON.parse(content);
  } catch {
    return {};
  }
}

// ================================================================
// AUTHENTICATION HANDLERS
// ================================================================

/**
 * تسجيل مستخدم جديد
 * الآن بسيط وسريع: بدون verification codes
 * Telegram اختياري تماماً
 */
export async function handleRegister(request, env) {
  const body = await request.json();
  const { username, email, password, phone, telegramId } = body;

  // Validation
  const userErr = validateUsername(username);
  if (userErr) return jsonResponse({ error: userErr }, 400);

  const emailErr = validateEmail(email);
  if (emailErr) return jsonResponse({ error: emailErr }, 400);

  const passErr = validatePassword(password);
  if (passErr) return jsonResponse({ error: passErr }, 400);

  if (phone) {
    const phoneErr = validatePhoneNumber(phone);
    if (phoneErr) return jsonResponse({ error: phoneErr }, 400);
  }

  if (telegramId) {
    const telegramErr = validateTelegramId(telegramId);
    if (telegramErr) return jsonResponse({ error: telegramErr }, 400);
  }

  // تحقق من عدم وجود اسم مستخدم مشابه
  const users = await getAllUsers(env);
  if (users[username]) {
    return jsonResponse({ error: "Username already exists" }, 409);
  }
  if (Object.values(users).find((u) => u.email === email)) {
    return jsonResponse({ error: "Email already exists" }, 409);
  }
  if (phone && Object.values(users).find((u) => u.phone === phone)) {
    return jsonResponse({ error: "Phone number already linked to another account" }, 409);
  }
  if (
    telegramId &&
    Object.values(users).find((u) => u.telegramId === telegramId)
  ) {
    return jsonResponse({ error: "Telegram ID already linked to another account" }, 409);
  }

  // إنشاء المستخدم
  const passwordHash = await hashPassword(password);
  users[username] = {
    username,
    email,
    passwordHash,
    phone: phone || "",
    telegramId: telegramId || "",
    createdAt: new Date().toISOString(),
    isActive: true, // ✅ فعّال فوراً (بدون انتظار verification)
    isAdmin: username === env.ADMIN_USERNAME,
  };
  await saveAllUsers(env, users);

  // إنشاء لوحة المستخدم الفارغة
  const dashboard = {
    username,
    events: [],
    createdAt: new Date().toISOString(),
  };
  await saveUserDashboard(env, username, dashboard);

  // إرسال رسالة ترحيب اختيارية عبر Telegram
  if (telegramId) {
    await sendTelegramMessage(
      env,
      telegramId,
      `🎉 <b>مرحباً ${username}!</b>\n\n` +
      `✅ تم إنشاء حسابك بنجاح في Chrona\n` +
      `🔗 الرابط: https://chrona.velora.workers.dev\n\n` +
      `يمكنك الآن تسجيل الدخول والبدء!`
    );
  }

  return jsonResponse(
    {
      success: true,
      message: "Account created successfully! You can log in now.",
      username,
      telegramConfigured: !!telegramId,
    },
    201
  );
}

/**
 * تسجيل دخول المستخدم
 * يدعم اسم المستخدم أو البريد الإلكتروني
 */
export async function handleLogin(request, env) {
  const body = await request.json();
  const { username, password } = body;

  if (!username || !password) {
    return jsonResponse({ error: "Username/Email and password are required" }, 400);
  }

  const users = await getAllUsers(env);

  // البحث عن المستخدم باسم المستخدم أو البريد
  let user = users[username];
  if (!user) {
    user = Object.values(users).find((u) => u.email === username);
  }

  if (!user) {
    return jsonResponse({ error: "Invalid credentials" }, 401);
  }

  // تحقق من كلمة السر
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return jsonResponse({ error: "Invalid credentials" }, 401);
  }

  return jsonResponse({
    success: true,
    username: user.username,
    isAdmin: user.isAdmin || false,
    profile: {
      email: user.email || "",
      phone: user.phone || "",
      telegramId: user.telegramId || "",
    },
  });
}

/**
 * ✅ حذفنا handleVerify تماماً
 * لا حاجة للتحقق - التسجيل فوري
 */

/**
 * طلب إعادة تعيين كلمة السر
 */
export async function handleRequestReset(request, env) {
  const { email } = await request.json();

  if (!email) {
    return jsonResponse({ error: "Email is required" }, 400);
  }

  const users = await getAllUsers(env);
  const user = Object.values(users).find((u) => u.email === email);

  if (!user) {
    // لا نخبره أن البريد غير موجود (أمان)
    return jsonResponse({
      success: true,
      message: "If this email exists, a reset link has been sent",
    });
  }

  // إنشاء كود إعادة التعيين
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  await storePasswordResetCode(env, user.username, resetCode);

  // إرسال الكود عبر Telegram إذا كان مرتبطاً
  if (user.telegramId) {
    await sendTelegramMessage(
      env,
      user.telegramId,
      `🔐 <b>كود إعادة تعيين كلمة السر</b>\n\n` +
      `الكود: <code>${resetCode}</code>\n\n` +
      `ساري لمدة 15 دقيقة فقط\n` +
      `إذا لم تطلب هذا، تجاهل الرسالة`
    );
  }

  return jsonResponse({
    success: true,
    message: "Reset code sent",
    username: user.username,
  });
}

/**
 * تعيين كلمة السر الجديدة
 */
export async function handleResetPassword(request, env) {
  const { username, code, newPassword } = await request.json();

  if (!username || !code || !newPassword) {
    return jsonResponse({ error: "All fields are required" }, 400);
  }

  const passErr = validatePassword(newPassword);
  if (passErr) return jsonResponse({ error: passErr }, 400);

  // تحقق من الكود
  const storedCode = await getPasswordResetCode(env, username);
  if (!storedCode || storedCode !== code) {
    return jsonResponse({ error: "Invalid or expired code" }, 400);
  }

  const users = await getAllUsers(env);
  if (!users[username]) {
    return jsonResponse({ error: "User not found" }, 404);
  }

  // حدّث كلمة السر
  users[username].passwordHash = await hashPassword(newPassword);
  await saveAllUsers(env, users);
  await deletePasswordResetCode(env, username);

  return jsonResponse({ success: true, message: "Password reset successfully" });
}

// ================================================================
// EVENTS HANDLERS
// ================================================================

export async function handleGetEvents(request, env, username) {
  const dashboard = await getUserDashboard(env, username);
  if (!dashboard) {
    return jsonResponse({ error: "User not found" }, 404);
  }

  const events = (dashboard.events || []).map(migrateEvent);
  return jsonResponse({ events });
}

export async function handleCreateEvent(request, env, username) {
  const body = await request.json();
  const {
    title,
    description,
    date,
    start,
    end,
    notes,
    alert,
    notifyVia,
    color,
    type,
    calendar,
    status,
    location,
    guests,
    recurrence,
  } = body;

  // Validation
  const titleErr = validateEventTitle(title);
  if (titleErr) return jsonResponse({ error: titleErr }, 400);

  const dateErr = validateDateFormat(date);
  if (dateErr) return jsonResponse({ error: dateErr }, 400);

  const dashboard = await getUserDashboard(env, username);
  if (!dashboard) return jsonResponse({ error: "User not found" }, 404);

  // إنشاء الحدث
  const event = {
    id: generateId(),
    title: title.trim(),
    description: (description || "").trim(),
    date,
    start: start || "09:00",
    end: end || "10:00",
    notes: notes || "",
    alert: alert || "now",
    notifyVia: Array.isArray(notifyVia) ? notifyVia : [],
    color: color || null,
    type: type || calendar || "work",
    status: status || "pending",
    calendar: calendar || type || "work",
    location: location || "",
    guests: guests || "",
    recurrence: recurrence || "none",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // حفظ في لوحة المستخدم
  if (!dashboard.events) dashboard.events = [];
  dashboard.events.push(event);
  await saveUserDashboard(env, username, dashboard);

  // حفظ في ملف الوظائف
  const jobs = await getJobsForDate(env, date);
  jobs.push(event);
  await saveJobsForDate(env, date, jobs);

  // إرسال إشعار فوري إذا لزم الأمر
  if (alert === "now") {
    for (const target of event.notifyVia) {
      if (/^\d+$/.test(target)) {
        await sendTelegramMessage(
          env,
          target,
          `🔔 <b>${event.title}</b>\n\n` +
          `📅 ${event.date}\n` +
          `⏰ ${event.start}`
        );
      }
    }
  }

  return jsonResponse({ success: true, event }, 201);
}

export async function handleUpdateEvent(request, env, username, eventId) {
  const body = await request.json();
  const {
    title,
    description,
    date,
    start,
    end,
    notes,
    alert,
    notifyVia,
    color,
    type,
    status,
    calendar,
    location,
    guests,
    recurrence,
  } = body;

  const dashboard = await getUserDashboard(env, username);
  if (!dashboard) return jsonResponse({ error: "User not found" }, 404);

  const eventIndex = (dashboard.events || []).findIndex((e) => e.id === eventId);
  if (eventIndex === -1) return jsonResponse({ error: "Event not found" }, 404);

  const event = dashboard.events[eventIndex];
  const oldDate = event.date;

  // تحديث الحقول
  if (title !== undefined) {
    const err = validateEventTitle(title);
    if (err) return jsonResponse({ error: err }, 400);
    event.title = title.trim();
  }
  if (description !== undefined) event.description = description.trim();
  if (date) {
    const err = validateDateFormat(date);
    if (err) return jsonResponse({ error: err }, 400);
    event.date = date;
  }
  if (start !== undefined) event.start = start;
  if (end !== undefined) event.end = end;
  if (notes !== undefined) event.notes = notes;
  if (alert !== undefined) event.alert = alert;
  if (notifyVia !== undefined)
    event.notifyVia = Array.isArray(notifyVia) ? notifyVia : [];
  if (color !== undefined) event.color = color;
  if (type !== undefined) event.type = type;
  if (calendar !== undefined) event.calendar = calendar;
  if (location !== undefined) event.location = location;
  if (guests !== undefined) event.guests = guests;
  if (recurrence !== undefined) event.recurrence = recurrence;
  if (status && ["pending", "in-progress", "completed"].includes(status)) {
    event.status = status;
  }
  event.updatedAt = new Date().toISOString();

  dashboard.events[eventIndex] = event;
  await saveUserDashboard(env, username, dashboard);

  // تحديث ملف الوظائف إذا تغير التاريخ
  const newDate = event.date;
  if (oldDate !== newDate) {
    const oldJobs = await getJobsForDate(env, oldDate);
    await saveJobsForDate(
      env,
      oldDate,
      oldJobs.filter((j) => j.id !== eventId)
    );
    const newJobs = await getJobsForDate(env, newDate);
    newJobs.push(event);
    await saveJobsForDate(env, newDate, newJobs);
  } else {
    const jobs = await getJobsForDate(env, newDate);
    const jobIndex = jobs.findIndex((j) => j.id === eventId);
    if (jobIndex !== -1) {
      jobs[jobIndex] = event;
      await saveJobsForDate(env, newDate, jobs);
    }
  }

  return jsonResponse({ success: true, event });
}

export async function handleDeleteEvent(request, env, username, eventId) {
  const dashboard = await getUserDashboard(env, username);
  if (!dashboard) return jsonResponse({ error: "User not found" }, 404);

  const eventIndex = (dashboard.events || []).findIndex((e) => e.id === eventId);
  if (eventIndex === -1) return jsonResponse({ error: "Event not found" }, 404);

  const event = dashboard.events[eventIndex];
  dashboard.events.splice(eventIndex, 1);
  await saveUserDashboard(env, username, dashboard);

  // حذف من ملف الوظائف
  const jobs = await getJobsForDate(env, event.date);
  await saveJobsForDate(
    env,
    event.date,
    jobs.filter((j) => j.id !== eventId)
  );

  return jsonResponse({ success: true });
}

export async function handleGetEventsByDate(request, env, date) {
  const dateErr = validateDateFormat(date);
  if (dateErr) return jsonResponse({ error: dateErr }, 400);

  const events = await getJobsForDate(env, date);
  return jsonResponse({
    date,
    events: events.map(migrateEvent),
  });
}

export async function handleGetDashboard(request, env, username) {
  const dashboard = await getUserDashboard(env, username);
  if (!dashboard) return jsonResponse({ error: "User not found" }, 404);
  return jsonResponse(dashboard);
}

// ================================================================
// USER PROFILE HANDLERS
// ================================================================

export async function handleUpdateProfile(request, env, username) {
  const body = await request.json();
  const { email, phone, telegramId } = body;

  const users = await getAllUsers(env);
  const user = users[username];
  if (!user) return jsonResponse({ error: "User not found" }, 404);

  if (email) {
    const emailErr = validateEmail(email);
    if (emailErr) return jsonResponse({ error: emailErr }, 400);
    const taken = Object.values(users).find((u) => u.email === email && u.username !== username);
    if (taken) return jsonResponse({ error: "Email already in use" }, 409);
    user.email = email;
  }

  if (phone) {
    const phoneErr = validatePhoneNumber(phone);
    if (phoneErr) return jsonResponse({ error: phoneErr }, 400);
    user.phone = phone;
  }

  if (telegramId !== undefined) {
    if (telegramId) {
      const telegramErr = validateTelegramId(telegramId);
      if (telegramErr) return jsonResponse({ error: telegramErr }, 400);
    }
    user.telegramId = telegramId || "";
  }

  users[username] = user;
  await saveAllUsers(env, users);

  return jsonResponse({
    success: true,
    message: "Profile updated successfully",
    profile: {
      email: user.email,
      phone: user.phone,
      telegramId: user.telegramId,
    },
  });
}

export async function handleUpdatePassword(request, env, username) {
  const { currentPassword, newPassword } = await request.json();

  if (!currentPassword || !newPassword) {
    return jsonResponse({ error: "Both passwords are required" }, 400);
  }

  const passErr = validatePassword(newPassword);
  if (passErr) return jsonResponse({ error: passErr }, 400);

  const users = await getAllUsers(env);
  const user = users[username];
  if (!user) return jsonResponse({ error: "User not found" }, 404);

  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) return jsonResponse({ error: "Current password is incorrect" }, 401);

  user.passwordHash = await hashPassword(newPassword);
  users[username] = user;
  await saveAllUsers(env, users);

  return jsonResponse({ success: true, message: "Password updated successfully" });
}

// ================================================================
// ADMIN HANDLERS
// ================================================================

export async function handleAdminGetUsers(request, env) {
  const users = await getAllUsers(env);
  const safeUsers = Object.keys(users).map((username) => ({
    username,
    email: users[username].email,
    phone: users[username].phone,
    telegramId: users[username].telegramId,
    isActive: users[username].isActive,
    isAdmin: users[username].isAdmin || false,
    createdAt: users[username].createdAt,
  }));
  return jsonResponse(safeUsers);
}

export async function handleAdminDeleteUser(request, env, username) {
  const users = await getAllUsers(env);
  if (!users[username]) return jsonResponse({ error: "User not found" }, 404);

  delete users[username];
  await saveAllUsers(env, users);

  const { sha } = await githubGetFile(env, `dash-users/${username}.json`);
  if (sha) await githubDeleteFile(env, `dash-users/${username}.json`, sha, "Delete user");

  return jsonResponse({ success: true, message: "User deleted" });
}

export async function handleAdminToggleAdmin(request, env, username) {
  const { isAdmin } = await request.json();
  const users = await getAllUsers(env);
  if (!users[username]) return jsonResponse({ error: "User not found" }, 404);

  users[username].isAdmin = isAdmin;
  await saveAllUsers(env, users);

  return jsonResponse({ success: true });
}

export async function handleAdminGetAllEvents(request, env) {
  const users = await getAllUsers(env);
  const allEvents = [];

  for (const username of Object.keys(users)) {
    const dashboard = await getUserDashboard(env, username);
    if (dashboard && dashboard.events) {
      allEvents.push(
        ...dashboard.events.map((e) => ({ ...e, owner: username }))
      );
    }
  }

  return jsonResponse({
    totalEvents: allEvents.length,
    events: allEvents,
  });
}

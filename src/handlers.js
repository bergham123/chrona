// ================================================================
// src/handlers.js
// ================================================================

import {
  githubGetFile,
  githubPutFile,
  githubDeleteFile,
} from "./github.js";

import {
  jsonResponse,
  hashPassword,
  verifyPassword,
  generateId,
  getToday,
  validateUsername,
  validatePassword,
  validateEmail,
  validateEventTitle,
  generateVerificationCode,
  storeVerificationCode,
  getVerificationCode,
  deleteVerificationCode,
  sendTelegramMessage,
  migrateEvent,
} from "./helpers.js";

// ================================================================
// Data Access Layer (GitHub)
// ================================================================

async function getAllUsers(env) {
  const { content, exists } = await githubGetFile(env, "users/allusers.json");
  if (!exists || !content) return {};
  try { return JSON.parse(content); } catch { return {}; }
}

async function saveAllUsers(env, users) {
  const { sha } = await githubGetFile(env, "users/allusers.json");
  await githubPutFile(env, "users/allusers.json", JSON.stringify(users, null, 2), sha, "Update users list");
}

async function getUserDashboard(env, username) {
  const path = `dash-users/${username}.json`;
  const { content, exists } = await githubGetFile(env, path);
  if (!exists || !content) return null;
  try { return JSON.parse(content); } catch { return null; }
}

async function saveUserDashboard(env, username, dashboard) {
  const path = `dash-users/${username}.json`;
  const { sha } = await githubGetFile(env, path);
  await githubPutFile(env, path, JSON.stringify(dashboard, null, 2), sha, `Update dashboard ${username}`);
}

async function getJobsForDate(env, date) {
  const path = `jobs/${date}.json`;
  const { content, exists } = await githubGetFile(env, path);
  if (!exists || !content) return [];
  try { return JSON.parse(content); } catch { return []; }
}

async function saveJobsForDate(env, date, events) {
  const path = `jobs/${date}.json`;
  const { sha } = await githubGetFile(env, path);
  await githubPutFile(env, path, JSON.stringify(events, null, 2), sha, `Update jobs ${date}`);
}

// ================================================================
// Authentication
// ================================================================

export async function handleRegister(request, env) {
  const body = await request.json();
  const { username, email, password, phone, telegramId } = body;

  const userError = validateUsername(username);
  if (userError) return jsonResponse({ error: userError }, 400);
  const emailError = validateEmail(email);
  if (emailError) return jsonResponse({ error: emailError }, 400);
  const passError = validatePassword(password);
  if (passError) return jsonResponse({ error: passError }, 400);

  const users = await getAllUsers(env);
  if (users[username]) return jsonResponse({ error: "Username already exists" }, 409);
  if (Object.values(users).find(u => u.email === email)) return jsonResponse({ error: "Email already exists" }, 409);
  
  if (phone && Object.values(users).find(u => u.phone === phone)) {
    return jsonResponse({ error: "This phone number is linked to another account" }, 409);
  }
  if (telegramId && Object.values(users).find(u => u.telegramId === telegramId)) {
    return jsonResponse({ error: "This Telegram ID is linked to another account" }, 409);
  }

  const passwordHash = await hashPassword(password);
  users[username] = {
    username,
    email,
    passwordHash,
    phone: phone || "",
    telegramId: telegramId || "",
    createdAt: new Date().toISOString(),
    isActive: false,
    isAdmin: username === env.ADMIN_USERNAME,
  };
  await saveAllUsers(env, users);

  const dashboard = { username, tasks: [], createdAt: new Date().toISOString() };
  await saveUserDashboard(env, username, dashboard);

  if (telegramId) {
    const code = generateVerificationCode();
    await storeVerificationCode(env, username, code);
    await sendTelegramMessage(env, telegramId, `Hello ${username}! Your activation code is: ${code}`);
    return jsonResponse({ success: true, message: "Registered. Activation code sent to Telegram.", username }, 201);
  }

  users[username].isActive = true;
  await saveAllUsers(env, users);
  return jsonResponse({ success: true, message: "Registered successfully. You can log in now.", username }, 201);
}

export async function handleLogin(request, env) {
  const body = await request.json();
  const { username, password } = body;

  if (!username || !password) return jsonResponse({ error: "Username/Email and password are required" }, 400);

  const users = await getAllUsers(env);
  let user = users[username];
  if (!user) {
    user = Object.values(users).find(u => u.email === username);
  }

  if (!user) return jsonResponse({ error: "Invalid credentials" }, 401);
  if (!user.isActive) return jsonResponse({ error: "Account inactive. Please activate via Telegram." }, 403);

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return jsonResponse({ error: "Invalid credentials" }, 401);

  return jsonResponse({ 
    success: true, 
    username: user.username, 
    isAdmin: user.isAdmin || false,
    profile: {
      email: user.email || "",
      phone: user.phone || "",
      telegramId: user.telegramId || ""
    }
  });
}

export async function handleVerify(request, env) {
  const { username, code } = await request.json();
  if (!username || !code) return jsonResponse({ error: "Username and code are required" }, 400);

  const storedCode = await getVerificationCode(env, username);
  if (!storedCode || storedCode !== code) return jsonResponse({ error: "Invalid or expired code" }, 400);

  const users = await getAllUsers(env);
  if (!users[username]) return jsonResponse({ error: "User not found" }, 404);

  users[username].isActive = true;
  await saveAllUsers(env, users);
  await deleteVerificationCode(env, username);

  return jsonResponse({ success: true, message: "Account activated successfully" });
}

export async function handleRequestReset(request, env) {
  const { identifier } = await request.json();
  if (!identifier) return jsonResponse({ error: "Phone number, Telegram ID or Email is required" }, 400);

  const users = await getAllUsers(env);
  let user = Object.values(users).find(u => u.phone === identifier || u.telegramId === identifier || u.email === identifier);
  
  if (!user) return jsonResponse({ error: "User not found" }, 404);

  if (user.telegramId) {
    const code = generateVerificationCode();
    await storeVerificationCode(env, user.username, code);
    await sendTelegramMessage(env, user.telegramId, `Password reset code: ${code}`);
    return jsonResponse({ success: true, message: "Reset code sent to Telegram.", username: user.username });
  }

  return jsonResponse({ error: "No Telegram ID linked to this account to send code." }, 400);
}

export async function handleResetPassword(request, env) {
  const { username, code, newPassword } = await request.json();
  if (!username || !code || !newPassword) return jsonResponse({ error: "All fields are required" }, 400);

  const storedCode = await getVerificationCode(env, username);
  if (!storedCode || storedCode !== code) return jsonResponse({ error: "Invalid or expired code" }, 400);

  const users = await getAllUsers(env);
  if (!users[username]) return jsonResponse({ error: "User not found" }, 404);

  users[username].passwordHash = await hashPassword(newPassword);
  await saveAllUsers(env, users);
  await deleteVerificationCode(env, username);

  return jsonResponse({ success: true, message: "Password changed successfully" });
}

// ================================================================
// Events Management
// ================================================================

export async function handleGetEvents(request, env, username) {
  const dashboard = await getUserDashboard(env, username);
  if (!dashboard) return jsonResponse({ error: "User not found" }, 404);
  const events = (dashboard.tasks || []).map(migrateEvent);
  return jsonResponse({ events });
}

export async function handleCreateEvent(request, env, username) {
  const body = await request.json();
  const { title, description, date, start, end, notes, alert, notifyVia, color, type, status, calendar, location, guests, recurrence } = body;

  const titleError = validateEventTitle(title);
  if (titleError) return jsonResponse({ error: titleError }, 400);
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return jsonResponse({ error: "Date is required in YYYY-MM-DD format" }, 400);

  const dashboard = await getUserDashboard(env, username);
  if (!dashboard) return jsonResponse({ error: "User not found" }, 404);

  const event = {
    id: generateId(), title: title.trim(), description: (description || "").trim(),
    date, start: start || "09:00", end: end || "10:00", notes: notes || "",
    alert: alert || "now", notifyVia: Array.isArray(notifyVia) ? notifyVia : [],
    color: color || null, type: type || calendar || "work", status: status || "pending",
    calendar: calendar || type || "work", location: location || "", guests: guests || "",
    recurrence: recurrence || "none", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  };

  dashboard.tasks.push(event);
  await saveUserDashboard(env, username, dashboard);

  const jobs = await getJobsForDate(env, date);
  jobs.push(event);
  await saveJobsForDate(env, date, jobs);

  if (alert === "now") {
    for (const target of event.notifyVia) {
      if (/^\d+$/.test(target)) {
        await sendTelegramMessage(env, target, `🔔 New Event:\n${event.title}\nDate: ${date}\nTime: ${event.start}`);
      }
    }
  }

  return jsonResponse({ success: true, event }, 201);
}

export async function handleUpdateEvent(request, env, username, eventId) {
  const body = await request.json();
  const { title, description, date, start, end, notes, alert, notifyVia, color, type, status, calendar, location, guests, recurrence } = body;

  const dashboard = await getUserDashboard(env, username);
  if (!dashboard) return jsonResponse({ error: "User not found" }, 404);

  const taskIndex = dashboard.tasks.findIndex((t) => t.id === eventId);
  if (taskIndex === -1) return jsonResponse({ error: "Event not found" }, 404);

  const event = dashboard.tasks[taskIndex];
  const oldDate = event.date;
  
  if (title !== undefined) { const err = validateEventTitle(title); if (err) return jsonResponse({ error: err }, 400); event.title = title.trim(); }
  if (description !== undefined) event.description = description.trim();
  if (date) { if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return jsonResponse({ error: "Invalid date format" }, 400); event.date = date; }
  if (start !== undefined) event.start = start;
  if (end !== undefined) event.end = end;
  if (notes !== undefined) event.notes = notes;
  if (alert !== undefined) event.alert = alert;
  if (notifyVia !== undefined) event.notifyVia = Array.isArray(notifyVia) ? notifyVia : [];
  if (color !== undefined) event.color = color;
  if (type !== undefined) event.type = type;
  if (calendar !== undefined) event.calendar = calendar;
  if (location !== undefined) event.location = location;
  if (guests !== undefined) event.guests = guests;
  if (recurrence !== undefined) event.recurrence = recurrence;
  if (status) { if (!["pending", "in-progress", "completed"].includes(status)) return jsonResponse({ error: "Invalid status" }, 400); event.status = status; }
  event.updatedAt = new Date().toISOString();

  dashboard.tasks[taskIndex] = event;
  await saveUserDashboard(env, username, dashboard);

  const newDate = event.date;
  if (oldDate !== newDate) {
    const oldJobs = await getJobsForDate(env, oldDate);
    await saveJobsForDate(env, oldDate, oldJobs.filter(j => j.id !== eventId));
    const newJobs = await getJobsForDate(env, newDate);
    newJobs.push(event);
    await saveJobsForDate(env, newDate, newJobs);
  } else {
    const jobs = await getJobsForDate(env, newDate);
    const jobIndex = jobs.findIndex((j) => j.id === eventId);
    if (jobIndex !== -1) { jobs[jobIndex] = event; await saveJobsForDate(env, newDate, jobs); }
  }

  return jsonResponse({ success: true, event });
}

export async function handleDeleteEvent(request, env, username, eventId) {
  const dashboard = await getUserDashboard(env, username);
  if (!dashboard) return jsonResponse({ error: "User not found" }, 404);

  const taskIndex = dashboard.tasks.findIndex((t) => t.id === eventId);
  if (taskIndex === -1) return jsonResponse({ error: "Event not found" }, 404);

  const event = dashboard.tasks[taskIndex];
  dashboard.tasks.splice(taskIndex, 1);
  await saveUserDashboard(env, username, dashboard);

  const jobs = await getJobsForDate(env, event.date);
  await saveJobsForDate(env, event.date, jobs.filter((j) => j.id !== eventId));

  return jsonResponse({ success: true });
}

export async function handleGetEventsByDate(request, env, date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return jsonResponse({ error: "Invalid date format" }, 400);
  const events = await getJobsForDate(env, date);
  return jsonResponse({ date, events: events.map(migrateEvent) });
}

export async function handleGetDashboard(request, env, username) {
  const dashboard = await getUserDashboard(env, username);
  if (!dashboard) return jsonResponse({ error: "User not found" }, 404);
  return jsonResponse(dashboard);
}

// ================================================================
// User Profile Management (NEW)
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
    const taken = Object.values(users).find(u => u.email === email && u.username !== username);
    if (taken) return jsonResponse({ error: "Email already in use" }, 409);
    user.email = email;
  }

  user.phone = phone || "";
  if (telegramId !== undefined) user.telegramId = telegramId;

  users[username] = user;
  await saveAllUsers(env, users);

  return jsonResponse({ 
    success: true, 
    message: "Profile updated", 
    profile: { email: user.email, phone: user.phone, telegramId: user.telegramId } 
  });
}

export async function handleUpdatePassword(request, env, username) {
  const { currentPassword, newPassword } = await request.json();
  if (!currentPassword || !newPassword) return jsonResponse({ error: "Both passwords are required" }, 400);
  
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
// Admin Handlers
// ================================================================

export async function handleAdminGetUsers(request, env) {
  const users = await getAllUsers(env);
  const safeUsers = Object.keys(users).map((username) => ({
    username, email: users[username].email, phone: users[username].phone,
    telegramId: users[username].telegramId, isActive: users[username].isActive,
    isAdmin: users[username].isAdmin || false, createdAt: users[username].createdAt,
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
  let allEvents = [];
  for (const username of Object.keys(users)) {
    const dashboard = await getUserDashboard(env, username);
    if (dashboard?.tasks) {
      dashboard.tasks.forEach((task) => { allEvents.push({ ...migrateEvent(task), user: username }); });
    }
  }
  return jsonResponse(allEvents);
}

export async function getAllUsers(env) {
  const { content, exists } = await githubGetFile(env, "users/allusers.json");
  if (!exists || !content) return {};
  try { return JSON.parse(content); } catch { return {}; }
}

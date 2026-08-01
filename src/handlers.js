// ================================================================
// معالجات مسارات API
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
  formatDateToDDMMYY,
  getToday,
  validateUsername,
  validatePassword,
  validateTaskTitle,
  generateVerificationCode,
  storeVerificationCode,
  getVerificationCode,
  deleteVerificationCode,
  sendTelegramMessage,
} from "./helpers.js";

// ================================================================
// طبقة الوصول إلى البيانات (GitHub)
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
    "تحديث قائمة المستخدمين"
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
    `تحديث لوحة تحكم ${username}`
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

async function saveJobsForDate(env, date, tasks) {
  const path = `jobs/${date}.json`;
  const { sha } = await githubGetFile(env, path);
  await githubPutFile(
    env,
    path,
    JSON.stringify(tasks, null, 2),
    sha,
    `تحديث مهام ${date}`
  );
}

// ================================================================
// المصادقة (التسجيل، الدخول، التفعيل، استعادة كلمة المرور)
// ================================================================

export async function handleRegister(request, env) {
  const body = await request.json();
  const { username, password, telegramId } = body;

  const userError = validateUsername(username);
  if (userError) return jsonResponse({ error: userError }, 400);
  const passError = validatePassword(password);
  if (passError) return jsonResponse({ error: passError }, 400);
  if (!telegramId) {
    return jsonResponse({ error: "معرف تيليجرام مطلوب للتفعيل" }, 400);
  }

  const users = await getAllUsers(env);
  if (users[username]) {
    return jsonResponse({ error: "اسم المستخدم موجود بالفعل" }, 409);
  }

  // التأكد من عدم استخدام نفس التليجرام
  const existing = Object.values(users).find(u => u.telegramId === telegramId);
  if (existing) {
    return jsonResponse({ error: "هذا التليجرام مرتبط بحساب آخر" }, 409);
  }

  const passwordHash = await hashPassword(password);
  users[username] = {
    username,
    passwordHash,
    telegramId,
    createdAt: new Date().toISOString(),
    isActive: false,
    isAdmin: username === env.ADMIN_USERNAME,
  };
  await saveAllUsers(env, users);

  // إنشاء ملف المستخدم الفارغ
  const dashboard = {
    username,
    tasks: [],
    createdAt: new Date().toISOString(),
  };
  await saveUserDashboard(env, username, dashboard);

  // توليد وإرسال رمز التفعيل
  const code = generateVerificationCode();
  await storeVerificationCode(env, username, code);
  await sendTelegramMessage(
    env,
    telegramId,
    `مرحباً ${username}! رمز التفعيل الخاص بك هو: ${code}`
  );

  return jsonResponse(
    {
      success: true,
      message: "تم التسجيل. تم إرسال رمز التفعيل إلى تيليجرام.",
      username,
    },
    201
  );
}

export async function handleLogin(request, env) {
  const body = await request.json();
  const { username, password } = body;

  if (!username || !password) {
    return jsonResponse({ error: "اسم المستخدم وكلمة المرور مطلوبان" }, 400);
  }

  const users = await getAllUsers(env);
  const user = users[username];
  if (!user) {
    return jsonResponse({ error: "بيانات غير صحيحة" }, 401);
  }

  if (!user.isActive) {
    return jsonResponse({ error: "الحساب غير مفعّل. يرجى تفعيله عبر تيليجرام." }, 403);
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return jsonResponse({ error: "بيانات غير صحيحة" }, 401);
  }

  return jsonResponse({ success: true, username, message: "تم تسجيل الدخول بنجاح" });
}

export async function handleVerify(request, env) {
  const { username, code } = await request.json();
  if (!username || !code) {
    return jsonResponse({ error: "اسم المستخدم والرمز مطلوبان" }, 400);
  }

  const storedCode = await getVerificationCode(env, username);
  if (!storedCode || storedCode !== code) {
    return jsonResponse({ error: "رمز غير صحيح أو منتهي الصلاحية" }, 400);
  }

  const users = await getAllUsers(env);
  if (!users[username]) {
    return jsonResponse({ error: "المستخدم غير موجود" }, 404);
  }

  users[username].isActive = true;
  await saveAllUsers(env, users);
  await deleteVerificationCode(env, username);

  return jsonResponse({ success: true, message: "تم تفعيل الحساب بنجاح" });
}

export async function handleRequestReset(request, env) {
  const { username, telegramId } = await request.json();
  if (!username && !telegramId) {
    return jsonResponse({ error: "اسم المستخدم أو معرف التليجرام مطلوب" }, 400);
  }

  const users = await getAllUsers(env);
  let user = null;
  if (username) {
    user = users[username];
  } else {
    user = Object.values(users).find(u => u.telegramId === telegramId);
  }

  if (!user) {
    return jsonResponse({ error: "المستخدم غير موجود" }, 404);
  }

  const code = generateVerificationCode();
  await storeVerificationCode(env, user.username, code);
  await sendTelegramMessage(
    env,
    user.telegramId,
    `رمز إعادة تعيين كلمة المرور: ${code}`
  );

  return jsonResponse({ success: true, message: "تم إرسال الرمز إلى تيليجرام" });
}

export async function handleResetPassword(request, env) {
  const { username, code, newPassword } = await request.json();
  if (!username || !code || !newPassword) {
    return jsonResponse({ error: "جميع الحقول مطلوبة" }, 400);
  }

  const storedCode = await getVerificationCode(env, username);
  if (!storedCode || storedCode !== code) {
    return jsonResponse({ error: "رمز غير صحيح أو منتهي الصلاحية" }, 400);
  }

  const users = await getAllUsers(env);
  if (!users[username]) {
    return jsonResponse({ error: "المستخدم غير موجود" }, 404);
  }

  users[username].passwordHash = await hashPassword(newPassword);
  await saveAllUsers(env, users);
  await deleteVerificationCode(env, username);

  return jsonResponse({ success: true, message: "تم تغيير كلمة المرور بنجاح" });
}

// ================================================================
// إدارة المهام (مع الحقول الجديدة)
// ================================================================

export async function handleGetTasks(request, env, username) {
  const dashboard = await getUserDashboard(env, username);
  if (!dashboard) {
    return jsonResponse({ error: "المستخدم غير موجود" }, 404);
  }
  return jsonResponse({ tasks: dashboard.tasks });
}

export async function handleCreateTask(request, env, username) {
  const body = await request.json();
  const {
    title,
    description,
    date,        // YYYY-MM-DD
    time,
    endTime,
    notes,
    alert,
    notifyVia,
    color,
    type
  } = body;

  const titleError = validateTaskTitle(title);
  if (titleError) return jsonResponse({ error: titleError }, 400);

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return jsonResponse({ error: "التاريخ مطلوب بصيغة YYYY-MM-DD" }, 400);
  }

  const dashboard = await getUserDashboard(env, username);
  if (!dashboard) {
    return jsonResponse({ error: "المستخدم غير موجود" }, 404);
  }

  const jobDate = formatDateToDDMMYY(date);

  const task = {
    id: generateId(),
    title: title.trim(),
    description: (description || "").trim(),
    date: jobDate,
    time: time || "00:00",
    endTime: endTime || "",
    notes: notes || "",
    alert: alert || "now",
    notifyVia: Array.isArray(notifyVia) ? notifyVia : [],
    color: color || "#3498db",
    type: type || "other",
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  dashboard.tasks.push(task);
  await saveUserDashboard(env, username, dashboard);

  // إضافة إلى ملف jobs بالتاريخ المحدد
  const jobs = await getJobsForDate(env, jobDate);
  jobs.push(task);
  await saveJobsForDate(env, jobDate, jobs);

  // إرسال تنبيه فوري إذا اختار المستخدم
  if (alert === "now" && notifyVia.includes("telegram")) {
    const users = await getAllUsers(env);
    const user = users[username];
    if (user && user.telegramId) {
      await sendTelegramMessage(
        env,
        user.telegramId,
        `🔔 تذكير بمهمة جديدة:\nالعنوان: ${task.title}\nالتاريخ: ${jobDate}\nالوقت: ${task.time}`
      );
    }
  }

  return jsonResponse({ success: true, task }, 201);
}

export async function handleUpdateTask(request, env, username, taskId) {
  const body = await request.json();
  const { title, description, date, time, endTime, notes, alert, notifyVia, color, type, status } = body;

  const dashboard = await getUserDashboard(env, username);
  if (!dashboard) {
    return jsonResponse({ error: "المستخدم غير موجود" }, 404);
  }

  const taskIndex = dashboard.tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) {
    return jsonResponse({ error: "المهمة غير موجودة" }, 404);
  }

  const task = dashboard.tasks[taskIndex];
  if (title !== undefined) {
    const err = validateTaskTitle(title);
    if (err) return jsonResponse({ error: err }, 400);
    task.title = title.trim();
  }
  if (description !== undefined) task.description = description.trim();
  if (date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return jsonResponse({ error: "صيغة التاريخ غير صحيحة" }, 400);
    }
    task.date = formatDateToDDMMYY(date);
  }
  if (time !== undefined) task.time = time || "00:00";
  if (endTime !== undefined) task.endTime = endTime || "";
  if (notes !== undefined) task.notes = notes || "";
  if (alert !== undefined) task.alert = alert || "now";
  if (notifyVia !== undefined) task.notifyVia = Array.isArray(notifyVia) ? notifyVia : [];
  if (color !== undefined) task.color = color || "#3498db";
  if (type !== undefined) task.type = type || "other";
  if (status) {
    if (!["pending", "in-progress", "completed"].includes(status)) {
      return jsonResponse({ error: "الحالة غير صالحة" }, 400);
    }
    task.status = status;
  }
  task.updatedAt = new Date().toISOString();

  dashboard.tasks[taskIndex] = task;
  await saveUserDashboard(env, username, dashboard);

  // تحديث ملف jobs
  const jobDate = task.date;
  const jobs = await getJobsForDate(env, jobDate);
  const jobIndex = jobs.findIndex((j) => j.id === taskId);
  if (jobIndex !== -1) {
    jobs[jobIndex] = task;
    await saveJobsForDate(env, jobDate, jobs);
  }

  return jsonResponse({ success: true, task });
}

export async function handleDeleteTask(request, env, username, taskId) {
  const dashboard = await getUserDashboard(env, username);
  if (!dashboard) {
    return jsonResponse({ error: "المستخدم غير موجود" }, 404);
  }

  const taskIndex = dashboard.tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) {
    return jsonResponse({ error: "المهمة غير موجودة" }, 404);
  }

  const task = dashboard.tasks[taskIndex];
  dashboard.tasks.splice(taskIndex, 1);
  await saveUserDashboard(env, username, dashboard);

  // حذف من ملف jobs
  const jobDate = task.date;
  const jobs = await getJobsForDate(env, jobDate);
  const filtered = jobs.filter((j) => j.id !== taskId);
  await saveJobsForDate(env, jobDate, filtered);

  return jsonResponse({ success: true });
}

export async function handleGetJobsByDate(request, env, dateParam) {
  // dateParam يمكن أن يكون YYYY-MM-DD أو DD-MM-YY
  let date = dateParam;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    date = formatDateToDDMMYY(dateParam);
  }
  const tasks = await getJobsForDate(env, date);
  return jsonResponse({ date, tasks });
}

export async function handleGetDashboard(request, env, username) {
  const dashboard = await getUserDashboard(env, username);
  if (!dashboard) {
    return jsonResponse({ error: "المستخدم غير موجود" }, 404);
  }
  return jsonResponse(dashboard);
}

// ================================================================
// دوال المشرف
// ================================================================

export async function handleAdminGetUsers(request, env) {
  const users = await getAllUsers(env);
  const safeUsers = Object.keys(users).map((username) => ({
    username,
    telegramId: users[username].telegramId,
    isActive: users[username].isActive,
    isAdmin: users[username].isAdmin || false,
    createdAt: users[username].createdAt,
  }));
  return jsonResponse(safeUsers);
}

export async function handleAdminDeleteUser(request, env, username) {
  const users = await getAllUsers(env);
  if (!users[username]) {
    return jsonResponse({ error: "المستخدم غير موجود" }, 404);
  }
  delete users[username];
  await saveAllUsers(env, users);
  // حذف ملف المستخدم
  const { sha } = await githubGetFile(env, `dash-users/${username}.json`);
  if (sha) {
    await githubDeleteFile(env, `dash-users/${username}.json`, sha, "حذف المستخدم");
  }
  return jsonResponse({ success: true, message: "تم حذف المستخدم" });
}

export async function handleAdminToggleAdmin(request, env, username) {
  const { isAdmin } = await request.json();
  const users = await getAllUsers(env);
  if (!users[username]) {
    return jsonResponse({ error: "المستخدم غير موجود" }, 404);
  }
  users[username].isAdmin = isAdmin;
  await saveAllUsers(env, users);
  return jsonResponse({ success: true });
}

export async function handleAdminGetAllTasks(request, env) {
  const users = await getAllUsers(env);
  let allTasks = [];
  for (const username of Object.keys(users)) {
    const dashboard = await getUserDashboard(env, username);
    if (dashboard && dashboard.tasks) {
      dashboard.tasks.forEach((task) => {
        allTasks.push({ ...task, user: username });
      });
    }
  }
  return jsonResponse(allTasks);
}

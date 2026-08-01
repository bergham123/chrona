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
  getToday,
  validateUsername,
  validatePassword,
  validateTaskTitle,
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
// معالجات المصادقة
// ================================================================

export async function handleRegister(request, env) {
  const body = await request.json();
  const { username, password } = body;

  const userError = validateUsername(username);
  if (userError) return jsonResponse({ error: userError }, 400);
  const passError = validatePassword(password);
  if (passError) return jsonResponse({ error: passError }, 400);

  const users = await getAllUsers(env);
  if (users[username]) {
    return jsonResponse({ error: "اسم المستخدم موجود بالفعل" }, 409);
  }

  const passwordHash = await hashPassword(password);
  users[username] = {
    username,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  await saveAllUsers(env, users);

  const dashboard = {
    username,
    tasks: [],
    createdAt: new Date().toISOString(),
  };
  await saveUserDashboard(env, username, dashboard);

  return jsonResponse({ success: true, message: "تم التسجيل بنجاح", username }, 201);
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

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return jsonResponse({ error: "بيانات غير صحيحة" }, 401);
  }

  return jsonResponse({ success: true, username, message: "تم تسجيل الدخول بنجاح" });
}

// ================================================================
// معالجات المهام
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
  const { title, description } = body;

  const titleError = validateTaskTitle(title);
  if (titleError) return jsonResponse({ error: titleError }, 400);

  const dashboard = await getUserDashboard(env, username);
  if (!dashboard) {
    return jsonResponse({ error: "المستخدم غير موجود" }, 404);
  }

  const task = {
    id: generateId(),
    title: title.trim(),
    description: (description || "").trim(),
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // إضافة إلى ملف المستخدم
  dashboard.tasks.push(task);
  await saveUserDashboard(env, username, dashboard);

  // إضافة إلى ملف jobs حسب التاريخ
  const date = task.createdAt.split("T")[0];
  const jobs = await getJobsForDate(env, date);
  jobs.push(task);
  await saveJobsForDate(env, date, jobs);

  return jsonResponse({ success: true, task }, 201);
}

export async function handleUpdateTask(request, env, username, taskId) {
  const body = await request.json();
  const { title, description, status } = body;

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
  if (status) {
    if (!["pending", "in-progress", "completed"].includes(status)) {
      return jsonResponse({ error: "الحالة غير صالحة" }, 400);
    }
    task.status = status;
  }
  task.updatedAt = new Date().toISOString();

  dashboard.tasks[taskIndex] = task;
  await saveUserDashboard(env, username, dashboard);

  // تحديث في ملف jobs
  const date = task.createdAt.split("T")[0];
  const jobs = await getJobsForDate(env, date);
  const jobIndex = jobs.findIndex((j) => j.id === taskId);
  if (jobIndex !== -1) {
    jobs[jobIndex] = task;
    await saveJobsForDate(env, date, jobs);
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
  const date = task.createdAt.split("T")[0];
  const jobs = await getJobsForDate(env, date);
  const filtered = jobs.filter((j) => j.id !== taskId);
  await saveJobsForDate(env, date, filtered);

  return jsonResponse({ success: true });
}

export async function handleGetJobsByDate(request, env, date) {
  if (!date) {
    return jsonResponse({ error: "التاريخ مطلوب (YYYY-MM-DD)" }, 400);
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

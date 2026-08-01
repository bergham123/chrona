export async function handleCreateTask(request, env, username) {
  const body = await request.json();
  const {
    title,
    description,
    date,        // expected YYYY-MM-DD from date picker
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

  // التحقق من صحة التاريخ
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return jsonResponse({ error: "التاريخ مطلوب بصيغة YYYY-MM-DD" }, 400);
  }

  const dashboard = await getUserDashboard(env, username);
  if (!dashboard) {
    return jsonResponse({ error: "المستخدم غير موجود" }, 404);
  }

  // تحويل التاريخ إلى DD-MM-YY لتسمية ملف jobs
  const jobDate = formatDateToDDMMYY(date);

  const task = {
    id: generateId(),
    title: title.trim(),
    description: (description || "").trim(),
    date: jobDate,                // نخزن بصيغة DD-MM-YY
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

  return jsonResponse({ success: true, task }, 201);
}

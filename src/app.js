export const HTML_PAGE = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chrona - مدير المهام</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f5f7fb; padding: 20px; }
        .container { max-width: 900px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 12px; margin-bottom: 24px; }
        .form-group { margin-bottom: 16px; }
        label { display: block; font-weight: 600; margin-bottom: 4px; color: #34495e; }
        input, textarea, select { width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; }
        button { background: #3498db; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 16px; transition: 0.2s; }
        button:hover { background: #2980b9; }
        button.danger { background: #e74c3c; }
        button.danger:hover { background: #c0392b; }
        button.success { background: #2ecc71; }
        button.success:hover { background: #27ae60; }
        button.warning { background: #f39c12; }
        button.warning:hover { background: #e67e22; }
        .flex { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
        .task-item { background: #f8f9fa; border-radius: 8px; padding: 12px 16px; margin-bottom: 12px; border-right: 4px solid #3498db; }
        .task-item .title { font-weight: bold; font-size: 18px; }
        .task-item .desc { color: #555; margin: 6px 0; }
        .task-item .meta { font-size: 14px; color: #888; display: flex; gap: 16px; flex-wrap: wrap; }
        .task-item .actions { margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap; }
        .task-item .status { display: inline-block; padding: 2px 12px; border-radius: 20px; font-size: 13px; background: #ecf0f1; }
        .status.pending { background: #f1c40f; color: #7d6608; }
        .status.in-progress { background: #3498db; color: #fff; }
        .status.completed { background: #2ecc71; color: #fff; }
        .hidden { display: none; }
        .alert { padding: 12px; border-radius: 8px; margin-bottom: 16px; }
        .alert.error { background: #fde0e0; color: #c0392b; border: 1px solid #e74c3c; }
        .alert.success { background: #d5f5e3; color: #1e8449; border: 1px solid #2ecc71; }
        .tabs { display: flex; gap: 8px; margin-bottom: 20px; border-bottom: 2px solid #ecf0f1; padding-bottom: 8px; flex-wrap: wrap; }
        .tabs button { background: transparent; color: #7f8c8d; border: none; padding: 8px 16px; font-weight: 600; cursor: pointer; }
        .tabs button.active { color: #3498db; border-bottom: 3px solid #3498db; }
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        .logout-btn { float: left; background: #e67e22; }
        .logout-btn:hover { background: #d35400; }
        .stat-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; background: #ecf0f1; margin-left: 8px; }
        .color-preview { display: inline-block; width: 20px; height: 20px; border-radius: 4px; vertical-align: middle; margin-right: 8px; }
        .admin-user-item { border: 1px solid #ddd; border-radius: 8px; padding: 10px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; }
        #notifyVia label { display: inline-block; margin-left: 16px; }
        .checkbox-group label { display: inline-block; margin-left: 12px; }
        input[type="color"] { width: 60px; height: 40px; padding: 2px; }
    </style>
</head>
<body>
<div class="container" id="app">
    <h1>📋 Chrona · مدير المهام</h1>

    <!-- أقسام المصادقة -->
    <div id="authSection">
        <div class="tabs">
            <button class="active" data-tab="loginTab">تسجيل الدخول</button>
            <button data-tab="registerTab">إنشاء حساب</button>
            <button data-tab="resetTab">نسيت كلمة المرور</button>
        </div>
        <div id="loginTab" class="tab-content active">
            <div id="loginError" class="alert error hidden"></div>
            <div class="form-group">
                <label>اسم المستخدم</label>
                <input type="text" id="loginUsername" placeholder="أدخل اسم المستخدم">
            </div>
            <div class="form-group">
                <label>كلمة المرور</label>
                <input type="password" id="loginPassword" placeholder="أدخل كلمة المرور">
            </div>
            <button id="loginBtn">دخول</button>
        </div>
        <div id="registerTab" class="tab-content">
            <div id="registerError" class="alert error hidden"></div>
            <div class="form-group">
                <label>اسم المستخدم</label>
                <input type="text" id="regUsername" placeholder="اختر اسم مستخدم (3 أحرف على الأقل)">
            </div>
            <div class="form-group">
                <label>كلمة المرور</label>
                <input type="password" id="regPassword" placeholder="اختر كلمة مرور (6 أحرف على الأقل)">
            </div>
            <div class="form-group">
                <label>معرف تيليجرام (للتفعيل)</label>
                <input type="text" id="regTelegram" placeholder="أدخل معرفك في تيليجرام (chat_id)">
            </div>
            <button id="registerBtn">تسجيل</button>
            <div id="verifySection" class="hidden" style="margin-top: 16px;">
                <h4>تفعيل الحساب</h4>
                <div class="form-group">
                    <label>رمز التفعيل</label>
                    <input type="text" id="verifyCode" placeholder="أدخل الرمز المرسل إلى تيليجرام">
                </div>
                <button id="verifyBtn">تفعيل</button>
            </div>
        </div>
        <div id="resetTab" class="tab-content">
            <div id="resetError" class="alert error hidden"></div>
            <div class="form-group">
                <label>اسم المستخدم أو معرف تيليجرام</label>
                <input type="text" id="resetIdentifier" placeholder="أدخل اسم المستخدم أو معرف تيليجرام">
            </div>
            <button id="resetRequestBtn">طلب إعادة تعيين</button>
            <div id="resetPasswordSection" class="hidden" style="margin-top: 16px;">
                <div class="form-group">
                    <label>رمز التحقق</label>
                    <input type="text" id="resetCode" placeholder="أدخل الرمز المرسل">
                </div>
                <div class="form-group">
                    <label>كلمة المرور الجديدة</label>
                    <input type="password" id="resetNewPassword" placeholder="كلمة مرور جديدة">
                </div>
                <button id="resetConfirmBtn">تأكيد التغيير</button>
            </div>
        </div>
    </div>

    <!-- قسم المهام -->
    <div id="tasksSection" class="hidden">
        <div class="flex" style="justify-content: space-between;">
            <h2>مرحباً، <span id="displayUsername"></span></h2>
            <button id="logoutBtn" class="logout-btn">تسجيل خروج</button>
        </div>
        <hr style="margin: 16px 0;">

        <!-- إضافة مهمة -->
        <div style="background: #f0f4f8; padding: 16px; border-radius: 12px; margin-bottom: 20px;">
            <h3>➕ إضافة مهمة جديدة</h3>
            <div class="form-group">
                <label>عنوان المهمة</label>
                <input type="text" id="taskTitle" placeholder="أدخل عنوان المهمة">
            </div>
            <div class="form-group">
                <label>وصف (اختياري)</label>
                <textarea id="taskDesc" rows="2" placeholder="وصف المهمة"></textarea>
            </div>
            <div class="form-group">
                <label>📅 التاريخ</label>
                <input type="date" id="taskDate" required>
            </div>
            <div class="form-group">
                <label>🕐 وقت البدء</label>
                <input type="time" id="taskTime" value="08:00">
            </div>
            <div class="form-group">
                <label>🕒 وقت الانتهاء (اختياري)</label>
                <input type="time" id="taskEndTime">
            </div>
            <div class="form-group">
                <label>📝 ملاحظات</label>
                <textarea id="taskNotes" rows="2" placeholder="ملاحظات إضافية"></textarea>
            </div>
            <div class="form-group">
                <label>⏰ تنبيه</label>
                <select id="taskAlert">
                    <option value="now">فوري</option>
                    <option value="10min">قبل 10 دقائق</option>
                    <option value="1hour">قبل ساعة</option>
                    <option value="1day">قبل يوم</option>
                </select>
            </div>
            <div class="form-group" id="notifyVia">
                <label>📢 وسائل التنبيه</label>
                <div class="checkbox-group">
                    <label><input type="checkbox" value="telegram" checked> تيليجرام</label>
                    <label><input type="checkbox" value="whatsapp"> واتساب</label>
                </div>
            </div>
            <div class="form-group">
                <label>🎨 اللون</label>
                <input type="color" id="taskColor" value="#3498db">
            </div>
            <div class="form-group">
                <label>📂 نوع المهمة</label>
                <select id="taskType">
                    <option value="work">عمل</option>
                    <option value="personal">شخصي</option>
                    <option value="study">دراسة</option>
                    <option value="other">أخرى</option>
                </select>
            </div>
            <button id="addTaskBtn" class="success">إضافة</button>
        </div>

        <!-- إحصائيات سريعة -->
        <div id="statsBar" style="display: flex; gap: 16px; margin-bottom: 16px; flex-wrap: wrap;"></div>

        <!-- التبويبات -->
        <div class="tabs">
            <button class="active" data-tab="myTasksTab">مهامي</button>
            <button data-tab="jobsTab">المهام حسب التاريخ</button>
            <button id="adminTabBtn" data-tab="adminTab" class="hidden">🔧 المشرف</button>
        </div>

        <!-- مهامي -->
        <div id="myTasksTab" class="tab-content active">
            <div id="tasksList"></div>
        </div>

        <!-- المهام حسب التاريخ -->
        <div id="jobsTab" class="tab-content">
            <div class="flex">
                <input type="date" id="datePicker">
                <button id="getJobsBtn">عرض المهام</button>
            </div>
            <div id="jobsResult"></div>
        </div>

        <!-- لوحة المشرف -->
        <div id="adminTab" class="tab-content">
            <h3>🔧 لوحة تحكم المشرف</h3>
            <button id="adminRefreshBtn" class="success" style="margin-bottom: 12px;">تحديث</button>
            <h4>👥 المستخدمون</h4>
            <div id="adminUsersList"></div>
            <hr>
            <h4>📋 جميع المهام</h4>
            <div id="adminAllTasks"></div>
        </div>
    </div>
</div>

<script>
    // ============================================================
    // الكود الخاص بواجهة المستخدم (JavaScript)
    // ============================================================

    let currentUser = localStorage.getItem('chrona_user') || null;
    const API_BASE = window.location.origin;

    // عناصر DOM
    const authSection = document.getElementById('authSection');
    const tasksSection = document.getElementById('tasksSection');
    const displayUsername = document.getElementById('displayUsername');
    const tasksList = document.getElementById('tasksList');
    const jobsResult = document.getElementById('jobsResult');
    const datePicker = document.getElementById('datePicker');
    const statsBar = document.getElementById('statsBar');
    const adminTabBtn = document.getElementById('adminTabBtn');
    const adminUsersList = document.getElementById('adminUsersList');
    const adminAllTasks = document.getElementById('adminAllTasks');

    // دوال مساعدة
    function showAlert(element, message, type = 'error') {
        element.textContent = message;
        element.className = 'alert ' + type;
        element.classList.remove('hidden');
    }
    function hideAlert(element) {
        element.classList.add('hidden');
    }

    async function apiCall(endpoint, method = 'GET', body = null, username = null) {
        const headers = { 'Content-Type': 'application/json' };
        if (username) headers['X-Username'] = username;
        const options = { method, headers };
        if (body) options.body = JSON.stringify(body);
        const res = await fetch(API_BASE + endpoint, options);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'حدث خطأ');
        return data;
    }

    // المصادقة
    async function login(username, password) {
        const data = await apiCall('/auth/login', 'POST', { username, password });
        if (data.success) {
            currentUser = username;
            localStorage.setItem('chrona_user', username);
            showApp();
        } else {
            throw new Error(data.error || 'فشل تسجيل الدخول');
        }
    }

    async function register(username, password, telegramId) {
        const data = await apiCall('/auth/register', 'POST', { username, password, telegramId });
        if (data.success) {
            alert('✅ تم التسجيل بنجاح. تم إرسال رمز التفعيل إلى تيليجرام.');
            document.getElementById('verifySection').classList.remove('hidden');
            document.getElementById('regUsername').disabled = true;
            document.getElementById('regPassword').disabled = true;
            document.getElementById('regTelegram').disabled = true;
            document.getElementById('registerBtn').disabled = true;
        } else {
            throw new Error(data.error || 'فشل التسجيل');
        }
    }

    async function verify(username, code) {
        const data = await apiCall('/auth/verify', 'POST', { username, code });
        if (data.success) {
            alert('✅ تم تفعيل الحساب بنجاح. يمكنك تسجيل الدخول الآن.');
            document.getElementById('verifySection').classList.add('hidden');
            document.querySelector('[data-tab="loginTab"]').click();
            document.getElementById('loginUsername').value = username;
        } else {
            throw new Error(data.error || 'فشل التفعيل');
        }
    }

    async function requestReset(identifier) {
        const data = await apiCall('/auth/reset-request', 'POST', { username: identifier, telegramId: identifier });
        if (data.success) {
            alert('✅ تم إرسال رمز إعادة التعيين إلى تيليجرام.');
            document.getElementById('resetPasswordSection').classList.remove('hidden');
        } else {
            throw new Error(data.error || 'فشل الطلب');
        }
    }

    async function confirmReset(username, code, newPassword) {
        const data = await apiCall('/auth/reset', 'POST', { username, code, newPassword });
        if (data.success) {
            alert('✅ تم تغيير كلمة المرور بنجاح.');
            document.getElementById('resetPasswordSection').classList.add('hidden');
            document.querySelector('[data-tab="loginTab"]').click();
        } else {
            throw new Error(data.error || 'فشل التغيير');
        }
    }

    function logout() {
        currentUser = null;
        localStorage.removeItem('chrona_user');
        showAuth();
    }

    // المهام
    async function loadTasks() {
        if (!currentUser) return;
        try {
            const data = await apiCall('/tasks', 'GET', null, currentUser);
            const tasks = data.tasks || [];
            renderTasks(tasks);
            updateStats(tasks);
        } catch (err) {
            tasksList.innerHTML = '<div class="alert error">' + err.message + '</div>';
        }
    }

    function updateStats(tasks) {
        const total = tasks.length;
        const completed = tasks.filter(t => t.status === 'completed').length;
        const pending = tasks.filter(t => t.status === 'pending').length;
        const inProgress = tasks.filter(t => t.status === 'in-progress').length;
        statsBar.innerHTML = \`
            <span class="stat-badge">📊 المجموع: \${total}</span>
            <span class="stat-badge" style="background:#2ecc71;color:#fff;">✅ مكتملة: \${completed}</span>
            <span class="stat-badge" style="background:#f1c40f;">⏳ معلقة: \${pending}</span>
            <span class="stat-badge" style="background:#3498db;color:#fff;">🔄 قيد التنفيذ: \${inProgress}</span>
        \`;
    }

    function renderTasks(tasks) {
        if (!tasks.length) {
            tasksList.innerHTML = '<p style="color:#888;">📭 لا توجد مهام بعد. أضف مهمة جديدة!</p>';
            return;
        }
        let html = '';
        tasks.forEach(task => {
            const statusClass = task.status || 'pending';
            const statusText = statusClass === 'pending' ? '⏳ قيد الانتظار' :
                              statusClass === 'in-progress' ? '🔄 قيد التنفيذ' : '✅ مكتملة';
            const color = task.color || '#3498db';
            html += \`
                <div class="task-item" data-id="\${task.id}" style="border-right-color:\${color};">
                    <div class="title">
                        <span class="color-preview" style="background:\${color};"></span>
                        \${task.title}
                    </div>
                    <div class="desc">\${task.description || ''}</div>
                    <div class="meta">
                        <span>📅 \${task.date} \${task.time}</span>
                        \${task.endTime ? \`<span>⏳ \${task.endTime}</span>\` : ''}
                        <span>📂 \${task.type || 'other'}</span>
                        <span>⏰ \${task.alert === 'now' ? 'فوري' : task.alert === '10min' ? 'قبل 10 دقائق' : task.alert === '1hour' ? 'قبل ساعة' : 'قبل يوم'}</span>
                        <span>📢 \${(task.notifyVia || []).join('، ') || 'لا شيء'}</span>
                        <span>الحالة: <span class="status \${statusClass}">\${statusText}</span></span>
                    </div>
                    <div class="actions">
                        <button onclick="editTask('\${task.id}')" class="warning">✏️ تعديل</button>
                        <button onclick="deleteTask('\${task.id}')" class="danger">🗑️ حذف</button>
                        <select onchange="changeStatus('\${task.id}', this.value)" style="width:auto; padding:4px 8px;">
                            <option value="pending" \${statusClass === 'pending' ? 'selected' : ''}>⏳ قيد الانتظار</option>
                            <option value="in-progress" \${statusClass === 'in-progress' ? 'selected' : ''}>🔄 قيد التنفيذ</option>
                            <option value="completed" \${statusClass === 'completed' ? 'selected' : ''}>✅ مكتملة</option>
                        </select>
                    </div>
                </div>
            \`;
        });
        tasksList.innerHTML = html;
    }

    async function addTask() {
        const title = document.getElementById('taskTitle').value.trim();
        const description = document.getElementById('taskDesc').value.trim();
        const date = document.getElementById('taskDate').value;
        const time = document.getElementById('taskTime').value;
        const endTime = document.getElementById('taskEndTime').value;
        const notes = document.getElementById('taskNotes').value.trim();
        const alert = document.getElementById('taskAlert').value;
        const notifyVia = Array.from(document.querySelectorAll('#notifyVia input:checked')).map(el => el.value);
        const color = document.getElementById('taskColor').value;
        const type = document.getElementById('taskType').value;

        if (!title) { alert('⚠️ يرجى كتابة عنوان المهمة'); return; }
        if (!date) { alert('⚠️ يرجى اختيار التاريخ'); return; }

        try {
            const data = await apiCall('/tasks', 'POST', {
                title, description, date, time, endTime, notes, alert, notifyVia, color, type
            }, currentUser);
            if (data.success) {
                document.getElementById('taskTitle').value = '';
                document.getElementById('taskDesc').value = '';
                document.getElementById('taskDate').value = '';
                document.getElementById('taskTime').value = '08:00';
                document.getElementById('taskEndTime').value = '';
                document.getElementById('taskNotes').value = '';
                document.getElementById('taskAlert').value = 'now';
                document.querySelectorAll('#notifyVia input:checked').forEach(el => el.checked = false);
                document.querySelector('#notifyVia input[value="telegram"]').checked = true;
                document.getElementById('taskColor').value = '#3498db';
                document.getElementById('taskType').value = 'other';
                loadTasks();
            }
        } catch (err) {
            alert('❌ خطأ: ' + err.message);
        }
    }

    async function deleteTask(id) {
        if (!confirm('🗑️ هل أنت متأكد من حذف هذه المهمة؟')) return;
        try {
            await apiCall('/tasks/' + id, 'DELETE', null, currentUser);
            loadTasks();
        } catch (err) {
            alert('❌ خطأ: ' + err.message);
        }
    }

    async function changeStatus(id, newStatus) {
        try {
            await apiCall('/tasks/' + id, 'PUT', { status: newStatus }, currentUser);
            loadTasks();
        } catch (err) {
            alert('❌ خطأ: ' + err.message);
        }
    }

    function editTask(id) {
        const taskDiv = document.querySelector(\`.task-item[data-id="\${id}"]\`);
        if (!taskDiv) return;
        const titleElem = taskDiv.querySelector('.title');
        const descElem = taskDiv.querySelector('.desc');
        const currentTitle = titleElem.textContent.trim();
        const currentDesc = descElem.textContent.trim();
        const newTitle = prompt('✏️ عنوان المهمة:', currentTitle);
        if (newTitle === null) return;
        const newDesc = prompt('✏️ الوصف:', currentDesc);
        if (newDesc === null) return;
        apiCall('/tasks/' + id, 'PUT', { title: newTitle, description: newDesc }, currentUser)
            .then(() => loadTasks())
            .catch(err => alert('❌ خطأ: ' + err.message));
    }

    // المهام حسب التاريخ
    async function loadJobsByDate(date) {
        if (!date) return;
        try {
            const data = await apiCall('/jobs/' + date);
            const tasks = data.tasks || [];
            if (!tasks.length) {
                jobsResult.innerHTML = '<p style="color:#888;">📭 لا توجد مهام في هذا اليوم.</p>';
                return;
            }
            let html = '<h4>📅 المهام في ' + date + '</h4>';
            tasks.forEach(task => {
                html += \`
                    <div class="task-item" style="border-right-color:\${task.color || '#9b59b6'};">
                        <div class="title">\${task.title}</div>
                        <div class="desc">\${task.description || ''}</div>
                        <div class="meta">
                            <span>👤 المستخدم: \${task.user || 'غير معروف'}</span>
                            <span>🕐 \${task.time}</span>
                            <span>📂 \${task.type || 'other'}</span>
                        </div>
                    </div>
                \`;
            });
            jobsResult.innerHTML = html;
        } catch (err) {
            jobsResult.innerHTML = '<div class="alert error">' + err.message + '</div>';
        }
    }

    // دوال المشرف
    async function loadAdminData() {
        try {
            // جلب المستخدمين
            const users = await apiCall('/admin/users', 'GET', null, currentUser);
            let usersHtml = '';
            users.forEach(u => {
                usersHtml += \`
                    <div class="admin-user-item">
                        <span><strong>\${u.username}</strong> \${u.isAdmin ? '👑' : ''} \${u.isActive ? '✅' : '❌'}</span>
                        <span>تيليجرام: \${u.telegramId}</span>
                        <span>تاريخ: \${new Date(u.createdAt).toLocaleDateString()}</span>
                        <div>
                            <button onclick="toggleAdmin('\${u.username}', \${!u.isAdmin})" class="warning">\${u.isAdmin ? 'إزالة المشرف' : 'جعله مشرفاً'}</button>
                            <button onclick="deleteUser('\${u.username}')" class="danger">حذف</button>
                        </div>
                    </div>
                \`;
            });
            adminUsersList.innerHTML = usersHtml;

            // جلب جميع المهام
            const allTasks = await apiCall('/admin/tasks', 'GET', null, currentUser);
            let tasksHtml = '';
            if (allTasks.length === 0) {
                tasksHtml = '<p>لا توجد مهام.</p>';
            } else {
                allTasks.forEach(t => {
                    tasksHtml += \`
                        <div class="task-item" style="border-right-color:\${t.color || '#3498db'};">
                            <div class="title">\${t.title}</div>
                            <div class="meta">
                                <span>👤 \${t.user}</span>
                                <span>📅 \${t.date} \${t.time}</span>
                                <span>📂 \${t.type}</span>
                                <span>الحالة: \${t.status}</span>
                            </div>
                        </div>
                    \`;
                });
            }
            adminAllTasks.innerHTML = tasksHtml;
        } catch (err) {
            alert('❌ خطأ في تحميل بيانات المشرف: ' + err.message);
        }
    }

    async function toggleAdmin(username, isAdmin) {
        try {
            await apiCall('/admin/users/' + username + '/admin', 'PUT', { isAdmin }, currentUser);
            loadAdminData();
        } catch (err) {
            alert('❌ خطأ: ' + err.message);
        }
    }

    async function deleteUser(username) {
        if (!confirm('هل أنت متأكد من حذف المستخدم ' + username + '؟')) return;
        try {
            await apiCall('/admin/users/' + username, 'DELETE', null, currentUser);
            loadAdminData();
        } catch (err) {
            alert('❌ خطأ: ' + err.message);
        }
    }

    // تبديل واجهات
    function showApp() {
        authSection.classList.add('hidden');
        tasksSection.classList.remove('hidden');
        displayUsername.textContent = currentUser;
        loadTasks();
        const today = new Date().toISOString().split('T')[0];
        datePicker.value = today;
        loadJobsByDate(today);

        // التحقق من صلاحية المشرف
        apiCall('/admin/users', 'GET', null, currentUser)
            .then(() => {
                adminTabBtn.classList.remove('hidden');
                loadAdminData();
            })
            .catch(() => {
                adminTabBtn.classList.add('hidden');
            });
    }

    function showAuth() {
        authSection.classList.remove('hidden');
        tasksSection.classList.add('hidden');
        document.querySelectorAll('.alert').forEach(el => el.classList.add('hidden'));
        // إعادة تفعيل حقول التسجيل
        document.getElementById('regUsername').disabled = false;
        document.getElementById('regPassword').disabled = false;
        document.getElementById('regTelegram').disabled = false;
        document.getElementById('registerBtn').disabled = false;
        document.getElementById('verifySection').classList.add('hidden');
        document.getElementById('resetPasswordSection').classList.add('hidden');
    }

    // أحداث DOM
    document.addEventListener('DOMContentLoaded', function() {
        // التبويبات العامة
        document.querySelectorAll('.tabs button[data-tab]').forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.dataset.tab;
                this.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const parent = this.closest('.container') || document;
                parent.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
                document.getElementById(tabId).classList.add('active');
            });
        });

        // تسجيل الدخول
        document.getElementById('loginBtn').addEventListener('click', async function() {
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value;
            const errorEl = document.getElementById('loginError');
            hideAlert(errorEl);
            try {
                await login(username, password);
            } catch (err) {
                showAlert(errorEl, err.message, 'error');
            }
        });

        // التسجيل
        document.getElementById('registerBtn').addEventListener('click', async function() {
            const username = document.getElementById('regUsername').value.trim();
            const password = document.getElementById('regPassword').value;
            const telegramId = document.getElementById('regTelegram').value.trim();
            const errorEl = document.getElementById('registerError');
            hideAlert(errorEl);
            try {
                await register(username, password, telegramId);
            } catch (err) {
                showAlert(errorEl, err.message, 'error');
            }
        });

        // تفعيل الحساب
        document.getElementById('verifyBtn').addEventListener('click', async function() {
            const username = document.getElementById('regUsername').value.trim();
            const code = document.getElementById('verifyCode').value.trim();
            const errorEl = document.getElementById('registerError');
            hideAlert(errorEl);
            try {
                await verify(username, code);
            } catch (err) {
                showAlert(errorEl, err.message, 'error');
            }
        });

        // طلب إعادة تعيين كلمة المرور
        document.getElementById('resetRequestBtn').addEventListener('click', async function() {
            const identifier = document.getElementById('resetIdentifier').value.trim();
            const errorEl = document.getElementById('resetError');
            hideAlert(errorEl);
            try {
                await requestReset(identifier);
            } catch (err) {
                showAlert(errorEl, err.message, 'error');
            }
        });

        // تأكيد إعادة التعيين
        document.getElementById('resetConfirmBtn').addEventListener('click', async function() {
            const identifier = document.getElementById('resetIdentifier').value.trim();
            const code = document.getElementById('resetCode').value.trim();
            const newPassword = document.getElementById('resetNewPassword').value;
            const errorEl = document.getElementById('resetError');
            hideAlert(errorEl);
            try {
                await confirmReset(identifier, code, newPassword);
            } catch (err) {
                showAlert(errorEl, err.message, 'error');
            }
        });

        // إضافة مهمة
        document.getElementById('addTaskBtn').addEventListener('click', addTask);

        // تسجيل الخروج
        document.getElementById('logoutBtn').addEventListener('click', logout);

        // عرض المهام حسب التاريخ
        document.getElementById('getJobsBtn').addEventListener('click', function() {
            const date = datePicker.value;
            if (!date) {
                alert('⚠️ يرجى اختيار تاريخ');
                return;
            }
            loadJobsByDate(date);
        });

        // تحديث بيانات المشرف
        document.getElementById('adminRefreshBtn').addEventListener('click', loadAdminData);

        // التحقق من وجود مستخدم مسجل
        if (currentUser) {
            showApp();
        } else {
            showAuth();
        }

        // إدخال Enter
        document.getElementById('loginPassword').addEventListener('keydown', function(e) {
            if (e.key === 'Enter') document.getElementById('loginBtn').click();
        });
        document.getElementById('regPassword').addEventListener('keydown', function(e) {
            if (e.key === 'Enter') document.getElementById('registerBtn').click();
        });
        document.getElementById('taskTitle').addEventListener('keydown', function(e) {
            if (e.key === 'Enter') document.getElementById('addTaskBtn').click();
        });
    });
</script>
</body>
</html>`;

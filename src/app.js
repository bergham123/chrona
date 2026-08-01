// ================================================================
// واجهة المستخدم (HTML/CSS/JS)
// ================================================================

export const HTML_PAGE = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chrona - مدير المهام</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f5f7fb; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
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
        .tabs { display: flex; gap: 8px; margin-bottom: 20px; border-bottom: 2px solid #ecf0f1; padding-bottom: 8px; }
        .tabs button { background: transparent; color: #7f8c8d; border: none; padding: 8px 16px; font-weight: 600; cursor: pointer; }
        .tabs button.active { color: #3498db; border-bottom: 3px solid #3498db; }
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        #datePicker { max-width: 200px; }
        #jobsResult { margin-top: 16px; }
        .logout-btn { float: left; background: #e67e22; }
        .logout-btn:hover { background: #d35400; }
        .loading { opacity: 0.6; pointer-events: none; }
        .stat-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; background: #ecf0f1; margin-left: 8px; }
    </style>
</head>
<body>
<div class="container" id="app">
    <h1>📋 Chrona · مدير المهام</h1>

    <!-- أقسام تسجيل الدخول والتسجيل -->
    <div id="authSection">
        <div class="tabs">
            <button class="active" data-tab="loginTab">تسجيل الدخول</button>
            <button data-tab="registerTab">إنشاء حساب</button>
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
            <button id="registerBtn">تسجيل</button>
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
            <button id="addTaskBtn" class="success">إضافة</button>
        </div>

        <!-- إحصائيات سريعة -->
        <div id="statsBar" style="display: flex; gap: 16px; margin-bottom: 16px; flex-wrap: wrap;"></div>

        <!-- التبويبات -->
        <div class="tabs">
            <button class="active" data-tab="myTasksTab">مهامي</button>
            <button data-tab="jobsTab">المهام حسب التاريخ</button>
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
    </div>
</div>

<script>
    // ---- متغيرات عامة ----
    let currentUser = localStorage.getItem('chrona_user') || null;
    const API_BASE = window.location.origin;

    // ---- عناصر DOM ----
    const authSection = document.getElementById('authSection');
    const tasksSection = document.getElementById('tasksSection');
    const displayUsername = document.getElementById('displayUsername');
    const tasksList = document.getElementById('tasksList');
    const jobsResult = document.getElementById('jobsResult');
    const datePicker = document.getElementById('datePicker');
    const statsBar = document.getElementById('statsBar');

    // ---- دوال مساعدة ----
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

    // ---- المصادقة ----
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

    async function register(username, password) {
        const data = await apiCall('/auth/register', 'POST', { username, password });
        if (data.success) {
            alert('✅ تم التسجيل بنجاح، يمكنك تسجيل الدخول الآن');
            document.querySelector('[data-tab="loginTab"]').click();
            document.getElementById('loginUsername').value = username;
            document.getElementById('loginPassword').value = '';
        } else {
            throw new Error(data.error || 'فشل التسجيل');
        }
    }

    function logout() {
        currentUser = null;
        localStorage.removeItem('chrona_user');
        showAuth();
    }

    // ---- المهام ----
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
            html += \`
                <div class="task-item" data-id="\${task.id}">
                    <div class="title">\${task.title}</div>
                    <div class="desc">\${task.description || ''}</div>
                    <div class="meta">
                        <span>الحالة: <span class="status \${statusClass}">\${statusText}</span></span>
                        <span>📅 \${new Date(task.createdAt).toLocaleString()}</span>
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

    async function addTask(title, description) {
        if (!currentUser) return;
        try {
            const data = await apiCall('/tasks', 'POST', { title, description }, currentUser);
            if (data.success) {
                document.getElementById('taskTitle').value = '';
                document.getElementById('taskDesc').value = '';
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
        const currentTitle = titleElem.textContent;
        const currentDesc = descElem.textContent;
        const newTitle = prompt('✏️ عنوان المهمة:', currentTitle);
        if (newTitle === null) return;
        const newDesc = prompt('✏️ الوصف:', currentDesc);
        if (newDesc === null) return;
        apiCall('/tasks/' + id, 'PUT', { title: newTitle, description: newDesc }, currentUser)
            .then(() => loadTasks())
            .catch(err => alert('❌ خطأ: ' + err.message));
    }

    // ---- المهام حسب التاريخ ----
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
                    <div class="task-item" style="border-right-color:#9b59b6;">
                        <div class="title">\${task.title}</div>
                        <div class="desc">\${task.description || ''}</div>
                        <div class="meta">
                            <span>👤 المستخدم: \${task.user || 'غير معروف'}</span>
                            <span>الحالة: \${task.status || 'pending'}</span>
                        </div>
                    </div>
                \`;
            });
            jobsResult.innerHTML = html;
        } catch (err) {
            jobsResult.innerHTML = '<div class="alert error">' + err.message + '</div>';
        }
    }

    // ---- تبديل واجهات ----
    function showApp() {
        authSection.classList.add('hidden');
        tasksSection.classList.remove('hidden');
        displayUsername.textContent = currentUser;
        loadTasks();
        const today = new Date().toISOString().split('T')[0];
        datePicker.value = today;
        loadJobsByDate(today);
    }

    function showAuth() {
        authSection.classList.remove('hidden');
        tasksSection.classList.add('hidden');
        document.querySelectorAll('.alert').forEach(el => el.classList.add('hidden'));
    }

    // ---- أحداث ----
    document.addEventListener('DOMContentLoaded', function() {
        // التبويبات
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
            const errorEl = document.getElementById('registerError');
            hideAlert(errorEl);
            try {
                await register(username, password);
            } catch (err) {
                showAlert(errorEl, err.message, 'error');
            }
        });

        // إضافة مهمة
        document.getElementById('addTaskBtn').addEventListener('click', function() {
            const title = document.getElementById('taskTitle').value.trim();
            const description = document.getElementById('taskDesc').value.trim();
            if (!title) {
                alert('⚠️ يرجى كتابة عنوان المهمة');
                return;
            }
            addTask(title, description);
        });

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

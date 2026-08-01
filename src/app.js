export const HTML_PAGE = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chrona - مدير المهام</title>
    <style>
        :root {
            --primary: #378ADD;
            --primary-dark: #185FA5;
            --accent-teal: #1D9E75;
            --accent-coral: #D85A30;
            --accent-amber: #BA7517;
            --accent-purple: #7F77DD;
            --success: #2ecc71;
            --danger: #e74c3c;
            --warning: #f39c12;
            --text-primary: #1a1a1a;
            --text-secondary: #666;
            --text-muted: #999;
            --bg-light: #fafbfc;
            --bg-lighter: #f0f3f7;
            --border-light: #e0e0e0;
            --surface: #ffffff;
        }
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
            background: var(--bg-light); 
            padding: 20px;
            color: var(--text-primary);
        }
        
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: var(--surface); 
            border-radius: 12px; 
            padding: 32px;
            border: 1px solid var(--border-light);
        }
        
        h1 { 
            font-size: 28px;
            font-weight: 700;
            color: var(--text-primary); 
            margin-bottom: 32px;
            letter-spacing: -0.5px;
        }
        
        h2 { 
            font-size: 20px;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 20px;
        }
        
        h3 { 
            font-size: 16px;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 16px;
        }
        
        .form-group { 
            margin-bottom: 18px; 
        }
        
        label { 
            display: block; 
            font-weight: 500; 
            margin-bottom: 6px; 
            color: var(--text-primary);
            font-size: 14px;
        }
        
        input, textarea, select { 
            width: 100%; 
            padding: 12px 14px; 
            border: 1px solid var(--border-light); 
            border-radius: 8px; 
            font-size: 15px;
            transition: all 0.2s;
            background: var(--surface);
            color: var(--text-primary);
        }
        
        input:hover, textarea:hover, select:hover { 
            border-color: var(--primary);
            background: var(--bg-lighter);
        }
        
        input:focus, textarea:focus, select:focus { 
            outline: none;
            border-color: var(--primary);
            background: var(--surface);
            box-shadow: 0 0 0 3px rgba(55, 138, 221, 0.1);
        }
        
        button { 
            background: var(--primary); 
            color: #fff; 
            border: none; 
            padding: 12px 24px; 
            border-radius: 8px; 
            cursor: pointer; 
            font-size: 15px;
            font-weight: 500;
            transition: all 0.2s;
            border: 1px solid transparent;
        }
        
        button:hover { 
            background: var(--primary-dark);
            transform: translateY(-1px);
        }
        
        button:active { 
            transform: translateY(0);
        }
        
        button.danger { 
            background: var(--danger); 
        }
        
        button.danger:hover { 
            background: #c0392b;
        }
        
        button.success { 
            background: var(--success); 
        }
        
        button.success:hover { 
            background: #27ae60;
        }
        
        button.warning { 
            background: var(--warning); 
        }
        
        button.warning:hover { 
            background: #e67e22;
        }
        
        .flex { 
            display: flex; 
            gap: 16px; 
            flex-wrap: wrap; 
            align-items: center;
        }
        
        .grid-2 {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
        }
        
        .card {
            background: var(--bg-lighter);
            border: 1px solid var(--border-light);
            border-radius: 12px;
            padding: 20px;
            transition: all 0.2s;
        }
        
        .card:hover {
            border-color: var(--primary);
            box-shadow: 0 2px 8px rgba(55, 138, 221, 0.1);
        }
        
        .task-item { 
            background: var(--bg-lighter);
            border-radius: 10px; 
            padding: 16px; 
            margin-bottom: 16px; 
            border-left: 4px solid var(--primary);
            transition: all 0.2s;
        }
        
        .task-item:hover {
            border-left-color: var(--accent-teal);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .task-item .title { 
            font-weight: 600; 
            font-size: 16px;
            color: var(--text-primary);
            margin-bottom: 6px;
        }
        
        .task-item .desc { 
            color: var(--text-secondary); 
            margin: 8px 0;
            font-size: 14px;
        }
        
        .task-item .meta { 
            font-size: 13px; 
            color: var(--text-muted); 
            display: flex; 
            gap: 16px; 
            flex-wrap: wrap;
            margin: 8px 0;
        }
        
        .task-item .actions { 
            margin-top: 12px; 
            display: flex; 
            gap: 8px; 
            flex-wrap: wrap;
        }
        
        .task-item .status { 
            display: inline-block; 
            padding: 4px 12px; 
            border-radius: 6px; 
            font-size: 12px;
            font-weight: 500;
            background: var(--bg-light);
            color: var(--text-secondary);
        }
        
        .status.pending { 
            background: #FEF3C7;
            color: #92400e;
        }
        
        .status.in-progress { 
            background: #DBEAFE;
            color: var(--primary-dark);
        }
        
        .status.completed { 
            background: #D1FAE5;
            color: #065F46;
        }
        
        .hidden { display: none; }
        
        .alert { 
            padding: 14px 16px; 
            border-radius: 10px; 
            margin-bottom: 20px;
            border-left: 4px solid;
            font-size: 14px;
        }
        
        .alert.error { 
            background: #FEE2E2;
            color: #7F1D1D;
            border-left-color: var(--danger);
        }
        
        .alert.success { 
            background: #D1FAE5;
            color: #065F46;
            border-left-color: var(--success);
        }
        
        .tabs { 
            display: flex; 
            gap: 0; 
            margin-bottom: 24px; 
            border-bottom: 2px solid var(--border-light); 
            padding-bottom: 0;
            flex-wrap: wrap;
        }
        
        .tabs button { 
            background: transparent; 
            color: var(--text-secondary); 
            border: none; 
            padding: 14px 20px; 
            font-weight: 500;
            cursor: pointer;
            border-bottom: 3px solid transparent;
            margin-bottom: -2px;
            font-size: 15px;
            transition: all 0.2s;
        }
        
        .tabs button:hover {
            color: var(--text-primary);
            border-bottom-color: var(--border-light);
        }
        
        .tabs button.active { 
            color: var(--primary);
            border-bottom-color: var(--primary);
        }
        
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        
        .logout-btn { 
            background: var(--accent-coral);
        }
        
        .logout-btn:hover { 
            background: #B84621;
        }
        
        .stat-badge { 
            display: inline-block; 
            padding: 6px 14px; 
            border-radius: 6px; 
            background: var(--bg-lighter);
            color: var(--text-secondary);
            margin-left: 12px;
            font-weight: 500;
            font-size: 13px;
        }
        
        .color-preview { 
            display: inline-block; 
            width: 20px; 
            height: 20px; 
            border-radius: 4px; 
            vertical-align: middle; 
            margin-right: 8px;
            border: 1px solid var(--border-light);
        }
        
        .admin-user-item { 
            border: 1px solid var(--border-light); 
            border-radius: 10px; 
            padding: 14px; 
            margin-bottom: 12px; 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            flex-wrap: wrap;
            background: var(--bg-lighter);
            transition: all 0.2s;
        }
        
        .admin-user-item:hover {
            border-color: var(--primary);
        }
        
        #notifyVia label { 
            display: inline-block; 
            margin-right: 16px;
            margin-left: 0;
        }
        
        .checkbox-group label { 
            display: inline-block; 
            margin-right: 12px;
            margin-left: 0;
            font-weight: 400;
            cursor: pointer;
        }
        
        input[type="color"] { 
            width: 60px; 
            height: 40px; 
            padding: 2px;
            cursor: pointer;
        }
        
        .auth-card {
            max-width: 400px;
            margin: 40px auto;
            background: var(--surface);
            border: 1px solid var(--border-light);
            border-radius: 12px;
            padding: 32px;
        }
        
        .form-section {
            background: var(--bg-lighter);
            padding: 24px;
            border-radius: 12px;
            margin-bottom: 24px;
        }
        
        button.secondary {
            background: transparent;
            color: var(--primary);
            border: 1px solid var(--primary);
        }
        
        button.secondary:hover {
            background: rgba(55, 138, 221, 0.05);
        }
        
        .header-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 32px;
            padding-bottom: 20px;
            border-bottom: 1px solid var(--border-light);
        }
        
        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        hr { 
            border: none;
            border-top: 1px solid var(--border-light);
            margin: 24px 0;
        }
    </style>
</head>
<body>
<div class="container" id="app">
    <h1>📋 Chrona · مدير المهام</h1>

    <!-- أقسام المصادقة -->
    <div id="authSection">
        <div class="tabs">
            <button class="active" data-tab="loginTab">🔐 تسجيل الدخول</button>
            <button data-tab="registerTab">✨ إنشاء حساب</button>
            <button data-tab="resetTab">🔑 نسيت كلمة المرور</button>
        </div>
        
        <div id="loginTab" class="tab-content active">
            <div class="form-section">
                <div id="loginError" class="alert error hidden"></div>
                <div class="form-group">
                    <label>اسم المستخدم</label>
                    <input type="text" id="loginUsername" placeholder="أدخل اسم المستخدم">
                </div>
                <div class="form-group">
                    <label>كلمة المرور</label>
                    <input type="password" id="loginPassword" placeholder="أدخل كلمة المرور">
                </div>
                <button id="loginBtn" style="width: 100%; padding: 14px;">دخول</button>
            </div>
        </div>
        
        <div id="registerTab" class="tab-content">
            <div class="form-section">
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
                <button id="registerBtn" style="width: 100%; padding: 14px;">تسجيل</button>
            </div>
            <div id="verifySection" class="hidden">
                <div class="form-section">
                    <h3>تفعيل الحساب</h3>
                    <div class="form-group">
                        <label>رمز التفعيل</label>
                        <input type="text" id="verifyCode" placeholder="أدخل الرمز المرسل إلى تيليجرام">
                    </div>
                    <button id="verifyBtn" style="width: 100%; padding: 14px;">تفعيل</button>
                </div>
            </div>
        </div>
        
        <div id="resetTab" class="tab-content">
            <div class="form-section">
                <div id="resetError" class="alert error hidden"></div>
                <div class="form-group">
                    <label>اسم المستخدم أو معرف تيليجرام</label>
                    <input type="text" id="resetIdentifier" placeholder="أدخل اسم المستخدم أو معرف تيليجرام">
                </div>
                <button id="resetRequestBtn" style="width: 100%; padding: 14px;">طلب إعادة تعيين</button>
            </div>
            <div id="resetPasswordSection" class="hidden">
                <div class="form-section">
                    <div class="form-group">
                        <label>رمز التحقق</label>
                        <input type="text" id="resetCode" placeholder="أدخل الرمز المرسل">
                    </div>
                    <div class="form-group">
                        <label>كلمة المرور الجديدة</label>
                        <input type="password" id="resetNewPassword" placeholder="كلمة مرور جديدة">
                    </div>
                    <button id="resetConfirmBtn" style="width: 100%; padding: 14px;">تأكيد التغيير</button>
                </div>
            </div>
        </div>
    </div>

    <!-- قسم المهام -->
    <div id="tasksSection" class="hidden">
        <div class="header-bar">
            <h2>مرحباً، <span id="displayUsername"></span></h2>
            <button id="logoutBtn" class="logout-btn">تسجيل خروج</button>
        </div>

        <!-- إضافة مهمة -->
        <div class="form-section" style="margin-bottom: 32px;">
            <h3>➕ إضافة مهمة جديدة</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div>
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
                </div>
                <div>
                    <div class="form-group">
                        <label>🕐 وقت البدء</label>
                        <input type="time" id="taskTime" value="08:00">
                    </div>
                    <div class="form-group">
                        <label>🕒 وقت الانتهاء (اختياري)</label>
                        <input type="time" id="taskEndTime">
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
                </div>
            </div>
            <div class="form-group">
                <label>📝 ملاحظات</label>
                <textarea id="taskNotes" rows="2" placeholder="ملاحظات إضافية"></textarea>
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
            <button id="addTaskBtn" class="success" style="width: 100%; padding: 14px;">إضافة مهمة</button>
        </div>

        <!-- إحصائيات سريعة -->
        <div id="statsBar" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; margin-bottom: 32px; flex-wrap: wrap;"></div>

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
            <div class="form-section" style="margin-bottom: 24px;">
                <div style="display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: end;">
                    <div class="form-group" style="margin-bottom: 0;">
                        <label>اختر التاريخ</label>
                        <input type="date" id="datePicker">
                    </div>
                    <button id="getJobsBtn" style="padding: 12px 24px;">🔍 عرض المهام</button>
                </div>
            </div>
            <div id="jobsResult"></div>
        </div>

        <!-- لوحة المشرف -->
        <div id="adminTab" class="tab-content">
            <div class="section-header">
                <h3>🔧 لوحة تحكم المشرف</h3>
                <button id="adminRefreshBtn" class="success" style="padding: 12px 20px;">🔄 تحديث</button>
            </div>
            
            <h3 style="margin-top: 28px; margin-bottom: 16px;">👥 المستخدمون</h3>
            <div id="adminUsersList" style="margin-bottom: 32px;"></div>
            
            <h3 style="margin-top: 28px; margin-bottom: 16px;">📋 جميع المهام</h3>
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

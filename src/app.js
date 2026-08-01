// ================================================================
// واجهة المستخدم مع التصميم الجديد (Chrona 4.0)
// ================================================================

export const HTML_PAGE = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chrona — Calendar & Task Command Center</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700;800&family=DM+Sans:wght@400;500;700;800&family=Noto+Sans+Arabic:wght@400;500;700;800&display=swap" rel="stylesheet">
    <style>
        /* سيتم تضمين style.css هنا، لكن يمكنك وضعه في ملف منفصل */
        /* لتوفير المساحة، سأضع فقط الفئات الأساسية، لكن يمكنك نسخ style.css كاملاً */
        /* هنا سأضع نسخة مختصرة، ويفضل وضع style.css في ملف منفصل */
        /* ولكن نظراً لأننا نعمل مع Worker، سنضمنه داخل HTML_PAGE */
        /* سأضع style.css في نهاية هذا الملف ضمن علامة style */
    </style>
</head>
<body>

<!-- شاشة المصادقة (تظهر عند عدم تسجيل الدخول) -->
<div id="authScreen" class="auth-screen">
    <div class="auth-layout">
        <!-- القسم الأيسر: العرض الترويجي -->
        <div class="auth-showcase">
            <div class="auth-brand">
                <div class="auth-logo logo-mark">C</div>
                <div>
                    <strong>Chrona</strong>
                    <small>PLAN · FOCUS · ACHIEVE</small>
                </div>
            </div>
            <div class="auth-showcase-copy">
                <div class="eyebrow-pill"><i></i> Local-first productivity</div>
                <h1>Time, <em>designed</em><br>around you.</h1>
                <p>A premium calendar with smart reminders, secure recovery and a beautifully fast workspace.</p>
            </div>
            <div class="auth-feature-grid">
                <div>
                    <span>01</span>
                    <strong>Everything in one place</strong>
                    <small>Your calendar and tasks stay synchronized automatically.</small>
                </div>
                <div>
                    <span>02</span>
                    <strong>Private recovery</strong>
                    <small>Telegram code or your personal question.</small>
                </div>
                <div>
                    <span>03</span>
                    <strong>Smart reminders</strong>
                    <small>Browser and Telegram, without reloads.</small>
                </div>
            </div>
            <div class="auth-showcase-orbit orbit-one"></div>
            <div class="auth-showcase-orbit orbit-two"></div>
        </div>

        <!-- القسم الأيمن: بطاقة المصادقة -->
        <div class="auth-card-premium">
            <div class="auth-mobile-brand">
                <div class="logo-mark">C</div>
                <strong>Chrona</strong>
            </div>
            <div class="auth-heading">
                <span class="auth-step" id="authStep">SECURE ACCESS</span>
                <h2 id="authTitle">Welcome back</h2>
                <p id="authSubtitle">Plan time, complete tasks and keep every reminder in one calm workspace.</p>
            </div>

            <!-- أزرار التبويب (تسجيل الدخول / إنشاء حساب / استرجاع) -->
            <div class="auth-tabs">
                <button class="auth-tab active" data-tab="loginTab" id="loginTabBtn">Log in</button>
                <button class="auth-tab" data-tab="registerTab" id="registerTabBtn">Create account</button>
            </div>

            <!-- تبويب تسجيل الدخول -->
            <div id="loginTab" class="tab-content active">
                <div id="loginError" class="alert error hidden" data-i18n-skip></div>
                <div class="auth-form-body">
                    <div class="form-group">
                        <label class="field-label">Email</label>
                        <input type="email" id="loginUsername" class="auth-field" placeholder="you@example.com">
                    </div>
                    <div class="form-group">
                        <label class="field-label">Password</label>
                        <input type="password" id="loginPassword" class="auth-field" placeholder="Enter your password">
                    </div>
                    <button id="loginBtn" class="primary auth-primary" style="width:100%;">Log in</button>
                    <div style="margin-top:14px; display:flex; justify-content:space-between;">
                        <button id="showResetBtn" class="auth-text-link" style="background:transparent;border:0;padding:0;">Forgot password?</button>
                        <span class="password-rule">🔒 8+ characters</span>
                    </div>
                </div>
            </div>

            <!-- تبويب إنشاء حساب -->
            <div id="registerTab" class="tab-content">
                <div id="registerError" class="alert error hidden" data-i18n-skip></div>
                <div class="auth-form-body">
                    <div class="form-group">
                        <label class="field-label">Username</label>
                        <input type="text" id="regUsername" class="auth-field" placeholder="Choose a username (3+ chars)">
                    </div>
                    <div class="form-group">
                        <label class="field-label">Password</label>
                        <input type="password" id="regPassword" class="auth-field" placeholder="8+ characters">
                    </div>
                    <div class="form-group">
                        <label class="field-label">Telegram ID (for activation)</label>
                        <input type="text" id="regTelegram" class="auth-field" placeholder="Your Telegram chat_id">
                    </div>
                    <button id="registerBtn" class="primary auth-primary" style="width:100%;">Create account</button>
                    <div id="verifySection" class="hidden" style="margin-top:16px; border-top:1px solid rgba(255,255,255,.07); padding-top:16px;">
                        <h4 style="font-size:12px;">Activate account</h4>
                        <div class="form-group">
                            <label class="field-label">Verification code</label>
                            <input type="text" id="verifyCode" class="auth-field" placeholder="6-digit code from Telegram">
                        </div>
                        <button id="verifyBtn" class="secondary" style="width:100%;">Activate</button>
                    </div>
                </div>
            </div>

            <!-- تبويب استرجاع كلمة المرور (مخفى) -->
            <div id="resetTab" class="tab-content" style="display:none;">
                <div id="resetError" class="alert error hidden"></div>
                <div class="auth-form-body">
                    <div class="form-group">
                        <label class="field-label">Username or Telegram ID</label>
                        <input type="text" id="resetIdentifier" class="auth-field" placeholder="Enter your username or Telegram ID">
                    </div>
                    <button id="resetRequestBtn" class="primary auth-primary" style="width:100%;">Request reset</button>
                    <div id="resetPasswordSection" class="hidden" style="margin-top:16px; border-top:1px solid rgba(255,255,255,.07); padding-top:16px;">
                        <div class="form-group">
                            <label class="field-label">Verification code</label>
                            <input type="text" id="resetCode" class="auth-field" placeholder="6-digit code">
                        </div>
                        <div class="form-group">
                            <label class="field-label">New password</label>
                            <input type="password" id="resetNewPassword" class="auth-field" placeholder="8+ characters">
                        </div>
                        <button id="resetConfirmBtn" class="secondary" style="width:100%;">Confirm reset</button>
                    </div>
                    <button id="backToLoginBtn" class="auth-text-link" style="margin-top:12px; background:transparent; border:0; padding:0;">← Back to login</button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- ====== مساحة العمل ====== -->
<div id="tasksSection" class="workspace-hidden">
    <!-- الشريط العلوي -->
    <header style="display:flex; align-items:center; justify-content:space-between; padding:14px 24px; background:rgba(255,255,255,.72); backdrop-filter:blur(20px); border-bottom:1px solid #e2e8f0;">
        <div style="display:flex; align-items:center; gap:14px;">
            <button id="sidebarToggle" class="icon-btn" aria-label="Toggle sidebar">☰</button>
            <div class="logo-mark" style="width:32px; height:32px; font-size:14px;">C</div>
            <span style="font-weight:800; font-size:18px; letter-spacing:-.03em;">Chrona</span>
            <div class="language-switcher">
                <span>🌐</span>
                <select id="languageSelect" aria-label="Language">
                    <option value="en">EN</option>
                    <option value="fr">FR</option>
                    <option value="ar">AR</option>
                </select>
            </div>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
            <span id="displayUsername" style="font-weight:700; font-size:14px;"></span>
            <button id="logoutBtn" class="logout-btn" style="background:#e67e22; border:0; padding:6px 14px; border-radius:10px; color:#fff; font-weight:800; font-size:12px;">Sign out</button>
        </div>
    </header>

    <!-- المحتوى الرئيسي -->
    <main style="max-width:1400px; margin:0 auto; padding:20px 24px;">

        <!-- بطاقة الترحيب (Workspace Hero) -->
        <div class="workspace-hero">
            <div class="hero-glow"></div>
            <div class="workspace-hero-copy">
                <div class="hero-kicker">📋 YOUR DAILY ORBIT</div>
                <h2>Design a calmer day.</h2>
                <p id="heroStats">0 open tasks, 0 due today.</p>
            </div>
            <div class="hero-metrics">
                <div class="hero-metric">
                    <strong id="openTasksCount">0</strong>
                    <span>Open tasks</span>
                </div>
                <div class="hero-metric">
                    <strong id="todayLoad">0%</strong>
                    <span>Today's load</span>
                </div>
                <div class="hero-metric">
                    <strong id="taskProgress">0%</strong>
                    <span>Task progress</span>
                </div>
                <button id="addTaskQuickBtn" class="hero-action">+ Create event</button>
            </div>
        </div>

        <!-- مركز المهام (Task Command Center) -->
        <div class="task-command-shell">
            <div class="task-command-top">
                <div>
                    <div class="task-command-kicker">⚡ EXECUTION STUDIO</div>
                    <h2>Move what matters.</h2>
                    <p><b id="taskCount">0</b> open tasks, <b id="dueTodayCount">0</b> due today.</p>
                </div>
                <div class="task-stat-ribbon">
                    <div><strong id="statTotal">0</strong><small>All</small></div>
                    <div><strong id="statCompleted">0</strong><small>Done</small></div>
                    <div><strong id="statPending">0</strong><small>Pending</small></div>
                </div>
            </div>

            <!-- نموذج الإضافة السريعة -->
            <div class="quick-task-form">
                <span class="quick-task-icon">+</span>
                <input type="text" id="taskTitle" placeholder="Capture a task… e.g. Send proposal @tomorrow !high #work">
                <button id="addTaskBtn">Add <kbd>⌘↵</kbd></button>
            </div>

            <!-- شريط التصفية -->
            <div class="task-toolbar">
                <div class="task-filter-row" id="taskFilterRow">
                    <button class="active" data-filter="all">All</button>
                    <button data-filter="open">Open</button>
                    <button data-filter="upcoming">Upcoming</button>
                    <button data-filter="completed">Completed</button>
                </div>
                <div class="task-toolbar-right">
                    <div class="task-category-filter" id="taskCategoryFilter">
                        <button class="active" data-category="all">All lists</button>
                        <button data-category="work">Work</button>
                        <button data-category="personal">Personal</button>
                        <button data-category="health">Health</button>
                        <button data-category="birthdays">Birthdays</button>
                    </div>
                    <div class="task-search">
                        <span>🔍</span>
                        <input type="text" id="taskSearchInput" placeholder="Filter tasks">
                        <small>⌘F</small>
                    </div>
                </div>
            </div>

            <!-- مجموعات المهام -->
            <div class="task-groups" id="taskGroups">
                <!-- سيتم ملؤها بواسطة JavaScript -->
            </div>
        </div>

        <!-- قسم المشرف (مخفي) -->
        <div id="adminSection" class="workspace-hidden" style="margin-top:30px;">
            <h2>🔧 Admin Dashboard</h2>
            <button id="adminRefreshBtn" class="primary" style="margin-bottom:16px;">Refresh</button>
            <div id="adminUsersList"></div>
            <hr>
            <div id="adminAllTasks"></div>
        </div>

    </main>
</div>

<script>
    // ============================================================
    // JavaScript الخاص بواجهة المستخدم (نفس السكريبت السابق مع تعديلات طفيفة)
    // ============================================================

    // المتغيرات العامة
    let currentUser = localStorage.getItem('chrona_user') || null;
    const API_BASE = window.location.origin;
    let allTasks = [];
    let currentFilter = 'all';
    let currentCategory = 'all';
    let searchTerm = '';

    // عناصر DOM
    const authScreen = document.getElementById('authScreen');
    const tasksSection = document.getElementById('tasksSection');
    const displayUsername = document.getElementById('displayUsername');
    const openTasksCount = document.getElementById('openTasksCount');
    const todayLoad = document.getElementById('todayLoad');
    const taskProgress = document.getElementById('taskProgress');
    const heroStats = document.getElementById('heroStats');
    const taskCount = document.getElementById('taskCount');
    const dueTodayCount = document.getElementById('dueTodayCount');
    const statTotal = document.getElementById('statTotal');
    const statCompleted = document.getElementById('statCompleted');
    const statPending = document.getElementById('statPending');
    const taskGroups = document.getElementById('taskGroups');
    const adminSection = document.getElementById('adminSection');
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

    // المصادقة (نفس الدوال السابقة)
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
            switchTab('loginTab');
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
            switchTab('loginTab');
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
            allTasks = data.tasks || [];
            renderTasks(allTasks);
            updateStats(allTasks);
        } catch (err) {
            taskGroups.innerHTML = '<div class="alert error">' + err.message + '</div>';
        }
    }

    function updateStats(tasks) {
        const total = tasks.length;
        const completed = tasks.filter(t => t.status === 'completed').length;
        const pending = tasks.filter(t => t.status === 'pending').length;
        const inProgress = tasks.filter(t => t.status === 'in-progress').length;
        const open = total - completed;
        const dueToday = tasks.filter(t => t.date === new Date().toISOString().split('T')[0]).length;

        openTasksCount.textContent = open;
        taskCount.textContent = open;
        dueTodayCount.textContent = dueToday;
        heroStats.textContent = `${open} open tasks, ${dueToday} due today.`;
        statTotal.textContent = total;
        statCompleted.textContent = completed;
        statPending.textContent = pending;

        const load = total > 0 ? Math.round((open / total) * 100) : 0;
        todayLoad.textContent = load + '%';
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
        taskProgress.textContent = progress + '%';
    }

    function renderTasks(tasks) {
        // تطبيق الفلاتر
        let filtered = tasks;
        if (currentFilter === 'open') filtered = filtered.filter(t => t.status !== 'completed');
        else if (currentFilter === 'completed') filtered = filtered.filter(t => t.status === 'completed');
        else if (currentFilter === 'upcoming') {
            const today = new Date().toISOString().split('T')[0];
            filtered = filtered.filter(t => t.date > today && t.status !== 'completed');
        }
        if (currentCategory !== 'all') filtered = filtered.filter(t => t.type === currentCategory);
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(t => t.title.toLowerCase().includes(term) || (t.description || '').toLowerCase().includes(term));
        }

        // تجميع حسب القوائم (افتراضي: جميع المهام في مجموعة واحدة)
        // نستخدم مجموعتين: Focus Lane (مثبتة ومتأخرة) و Today
        const today = new Date().toISOString().split('T')[0];
        const focus = filtered.filter(t => t.status !== 'completed' && (t.pinned || t.date < today));
        const upcoming = filtered.filter(t => t.status !== 'completed' && !t.pinned && t.date >= today);
        const done = filtered.filter(t => t.status === 'completed');

        let html = '';
        // Focus Lane
        html += buildTaskGroup('Focus lane', 'Pinned and overdue work', focus, true);
        // Today / Upcoming
        html += buildTaskGroup('Today', 'The next commitments in your orbit', upcoming, false);
        // Completed
        html += buildTaskGroup('Completed', 'Momentum already created', done, false);

        if (!filtered.length) {
            html = `<div class="task-empty">
                <span>📭</span>
                <h3>No tasks in this view</h3>
                <p>Capture a task to keep your momentum visible.</p>
                <button class="primary" onclick="document.getElementById('taskTitle').focus()">Add task</button>
            </div>`;
        }
        taskGroups.innerHTML = html;
    }

    function buildTaskGroup(title, subtitle, tasks, isFocus) {
        if (!tasks.length) return '';
        const cls = isFocus ? 'task-group focus-group' : 'task-group today-group';
        let items = tasks.map(task => buildTaskCard(task)).join('');
        return `<div class="${cls}">
            <div class="task-group-head">
                <div><span>${title}</span><small>${subtitle}</small></div>
                <b>${tasks.length}</b>
            </div>
            <div class="task-list">${items}</div>
        </div>`;
    }

    function buildTaskCard(task) {
        const statusClass = task.status || 'pending';
        const isComplete = statusClass === 'completed';
        const overdue = task.date && task.date < new Date().toISOString().split('T')[0] && !isComplete;
        const color = task.color || '#8b5cf6';
        const priority = task.priority || 'normal';
        const priorityLabel = priority.charAt(0).toUpperCase() + priority.slice(1);
        const dueDate = task.date ? new Date(task.date).toLocaleDateString() : 'No due date';
        return `<div class="task-card ${isComplete ? 'is-complete' : ''} ${overdue ? 'is-overdue' : ''}" style="--task-color:${color};" data-id="${task.id}">
            <div class="task-check" onclick="toggleTaskStatus('${task.id}')">${isComplete ? '✓' : ''}</div>
            <div class="task-card-body">
                <button class="task-title-button" onclick="openTaskDetails('${task.id}')">
                    <strong>${task.title}</strong>
                    <small>${task.description || ''}</small>
                </button>
                <div class="task-meta">
                    <span class="task-priority ${priority === 'urgent' ? 'priority-urgent' : priority === 'high' ? 'priority-high' : priority === 'low' ? 'priority-low' : ''}">${priorityLabel}</span>
                    <span class="task-due ${overdue ? 'overdue' : ''}">📅 ${dueDate} ${task.time || ''}</span>
                    ${task.type && task.type !== 'other' ? `<span class="task-category"><i style="background:${color};"></i> ${task.type}</span>` : ''}
                </div>
                ${task.subtasks && task.subtasks.length ? `<div class="subtask-progress"><span><i style="width:${Math.round(task.subtasks.filter(s=>s.done).length/task.subtasks.length*100)}%;"></i></span><small>${task.subtasks.filter(s=>s.done).length}/${task.subtasks.length}</small></div>` : ''}
            </div>
            <div class="task-card-actions">
                <button onclick="editTask('${task.id}')" title="Edit">✏️</button>
                <button onclick="deleteTask('${task.id}')" title="Delete">🗑️</button>
                <button onclick="pinTask('${task.id}')" class="${task.pinned ? 'active' : ''}" title="Pin">📌</button>
            </div>
        </div>`;
    }

    // دوال إدارة المهام (تستدعي API)
    async function addTask() {
        const title = document.getElementById('taskTitle').value.trim();
        if (!title) { alert('Please enter a task title'); return; }
        const description = ''; // يمكن إضافة حقول أخرى لاحقاً
        const date = new Date().toISOString().split('T')[0];
        const time = '08:00';
        const endTime = '';
        const notes = '';
        const alert = 'now';
        const notifyVia = ['telegram'];
        const color = '#8b5cf6';
        const type = 'other';

        try {
            const data = await apiCall('/tasks', 'POST', { title, description, date, time, endTime, notes, alert, notifyVia, color, type }, currentUser);
            if (data.success) {
                document.getElementById('taskTitle').value = '';
                loadTasks();
            }
        } catch (err) {
            alert('❌ Error: ' + err.message);
        }
    }

    async function deleteTask(id) {
        if (!confirm('Delete this task?')) return;
        try {
            await apiCall('/tasks/' + id, 'DELETE', null, currentUser);
            loadTasks();
        } catch (err) {
            alert('❌ Error: ' + err.message);
        }
    }

    async function toggleTaskStatus(id) {
        const task = allTasks.find(t => t.id === id);
        if (!task) return;
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        try {
            await apiCall('/tasks/' + id, 'PUT', { status: newStatus }, currentUser);
            loadTasks();
        } catch (err) {
            alert('❌ Error: ' + err.message);
        }
    }

    async function pinTask(id) {
        const task = allTasks.find(t => t.id === id);
        if (!task) return;
        try {
            await apiCall('/tasks/' + id, 'PUT', { pinned: !task.pinned }, currentUser);
            loadTasks();
        } catch (err) {
            alert('❌ Error: ' + err.message);
        }
    }

    function editTask(id) {
        const task = allTasks.find(t => t.id === id);
        if (!task) return;
        const newTitle = prompt('Edit task title:', task.title);
        if (newTitle !== null) {
            apiCall('/tasks/' + id, 'PUT', { title: newTitle }, currentUser)
                .then(() => loadTasks())
                .catch(err => alert('❌ Error: ' + err.message));
        }
    }

    function openTaskDetails(id) {
        // يمكن فتح نموذج تعديل متقدم
        alert('Task details: ' + id);
    }

    // دوال المشرف
    async function loadAdminData() {
        try {
            const users = await apiCall('/admin/users', 'GET', null, currentUser);
            let html = '';
            users.forEach(u => {
                html += `<div class="admin-user-item">
                    <span><strong>${u.username}</strong> ${u.isAdmin ? '👑' : ''} ${u.isActive ? '✅' : '❌'}</span>
                    <span>Telegram: ${u.telegramId}</span>
                    <span>Joined: ${new Date(u.createdAt).toLocaleDateString()}</span>
                    <div>
                        <button onclick="toggleAdmin('${u.username}', ${!u.isAdmin})" class="warning">${u.isAdmin ? 'Remove admin' : 'Make admin'}</button>
                        <button onclick="deleteUser('${u.username}')" class="danger">Delete</button>
                    </div>
                </div>`;
            });
            adminUsersList.innerHTML = html;

            const allTasks = await apiCall('/admin/tasks', 'GET', null, currentUser);
            let tasksHtml = '';
            allTasks.forEach(t => {
                tasksHtml += `<div class="task-item" style="border-right-color:${t.color || '#8b5cf6'};">
                    <div class="title">${t.title}</div>
                    <div class="meta">👤 ${t.user} — 📅 ${t.date} ${t.time}</div>
                </div>`;
            });
            adminAllTasks.innerHTML = tasksHtml || '<p>No tasks found.</p>';
        } catch (err) {
            alert('Admin error: ' + err.message);
        }
    }

    async function toggleAdmin(username, isAdmin) {
        try {
            await apiCall('/admin/users/' + username + '/admin', 'PUT', { isAdmin }, currentUser);
            loadAdminData();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    }

    async function deleteUser(username) {
        if (!confirm('Delete user ' + username + '?')) return;
        try {
            await apiCall('/admin/users/' + username, 'DELETE', null, currentUser);
            loadAdminData();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    }

    // تبديل الواجهات
    function showApp() {
        authScreen.classList.add('is-hidden');
        tasksSection.classList.remove('workspace-hidden');
        displayUsername.textContent = currentUser;
        loadTasks();
        // التحقق من صلاحية المشرف
        apiCall('/admin/users', 'GET', null, currentUser)
            .then(() => {
                adminSection.classList.remove('workspace-hidden');
                loadAdminData();
            })
            .catch(() => adminSection.classList.add('workspace-hidden'));
    }

    function showAuth() {
        authScreen.classList.remove('is-hidden');
        tasksSection.classList.add('workspace-hidden');
        document.querySelectorAll('.alert').forEach(el => el.classList.add('hidden'));
        // إعادة ضبط حقول التسجيل
        document.getElementById('regUsername').disabled = false;
        document.getElementById('regPassword').disabled = false;
        document.getElementById('regTelegram').disabled = false;
        document.getElementById('registerBtn').disabled = false;
        document.getElementById('verifySection').classList.add('hidden');
        document.getElementById('resetPasswordSection').classList.add('hidden');
    }

    function switchTab(tabId) {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
        document.querySelector(`[data-tab="${tabId}"]`)?.classList.add('active');
        document.getElementById(tabId)?.classList.add('active');
    }

    // أحداث DOM
    document.addEventListener('DOMContentLoaded', function() {
        // التبويبات في المصادقة
        document.querySelectorAll('.auth-tab').forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.dataset.tab;
                switchTab(tabId);
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

        // طلب إعادة تعيين
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

        // العودة إلى تسجيل الدخول
        document.getElementById('backToLoginBtn').addEventListener('click', function() {
            switchTab('loginTab');
        });

        // إظهار تبويب استرجاع كلمة المرور
        document.getElementById('showResetBtn').addEventListener('click', function() {
            switchTab('resetTab');
        });

        // إضافة مهمة سريعة
        document.getElementById('addTaskBtn').addEventListener('click', addTask);
        document.getElementById('taskTitle').addEventListener('keydown', function(e) {
            if (e.key === 'Enter') addTask();
        });

        // تسجيل الخروج
        document.getElementById('logoutBtn').addEventListener('click', logout);

        // أحداث التصفية
        document.querySelectorAll('#taskFilterRow button').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('#taskFilterRow button').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentFilter = this.dataset.filter;
                renderTasks(allTasks);
            });
        });

        document.querySelectorAll('#taskCategoryFilter button').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('#taskCategoryFilter button').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentCategory = this.dataset.category;
                renderTasks(allTasks);
            });
        });

        document.getElementById('taskSearchInput').addEventListener('input', function() {
            searchTerm = this.value;
            renderTasks(allTasks);
        });

        // تحديث المشرف
        document.getElementById('adminRefreshBtn').addEventListener('click', loadAdminData);

        // تحقق من المستخدم
        if (currentUser) {
            showApp();
        } else {
            showAuth();
        }

        // اختيار اللغة
        document.getElementById('languageSelect').addEventListener('change', function() {
            if (window.ChronaI18n) {
                window.ChronaI18n.setLanguage(this.value);
            }
        });
    });
</script>
</body>
</html>`;

// src/app.js
export const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chrona - Calendar</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Grotesk:wght@400;700;800&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            fontFamily: {
              display: ['Space Grotesk', 'sans-serif'],
              sans: ['DM Sans', 'sans-serif'],
            }
          }
        }
      }
    </script>
    <link rel="stylesheet" href="/assets/style.css">
</head>
<body class="dark:bg-[#0a0a12] bg-slate-50 text-slate-900 dark:text-slate-100 overflow-hidden h-screen flex flex-col">

    <div id="authRoot" class="hidden h-full"></div>

    <div id="appRoot" class="hidden h-full flex overflow-hidden relative">
        <div class="orb orb-a"></div>
        <div class="orb orb-b"></div>

        <aside id="sidebar" class="fixed md:relative z-40 w-72 h-full bg-white dark:bg-[#12121b] border-l border-slate-200 dark:border-white/10 p-5 flex flex-col gap-6 transition-transform duration-300 -translate-x-full md:translate-x-0 overflow-auto">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <span class="logo-mark text-sm">C</span>
                    <span class="font-display text-lg font-bold hidden sm:block">Chrona</span>
                </div>
                <button class="icon-btn md:hidden" data-action="sidebar">✕</button>
            </div>
            
            <div id="miniCalendar" class="text-slate-600 dark:text-slate-300"></div>
            
            <div id="calendarList" class="flex-1"></div>
            
            <div class="space-y-2 border-t border-slate-200 dark:border-white/10 pt-4">
                <button id="adminBtn" class="secondary w-full text-left hidden" data-action="admin">👑 Admin Panel</button>
                <button class="secondary w-full text-left" data-action="more">⚙ Tools</button>
                <button class="secondary w-full text-left danger" id="logoutBtn">↗ Sign out</button>
            </div>
        </aside>

        <main class="flex-1 flex flex-col h-full overflow-hidden">
            <header class="h-16 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#12121b]/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 z-30">
                <div class="flex items-center gap-4">
                    <button class="icon-btn md:hidden" data-action="sidebar">☰</button>
                    <button class="icon-btn" data-action="today">⦿ Today</button>
                    <div class="flex gap-1">
                        <button class="icon-btn" data-action="prev">‹</button>
                        <button class="icon-btn" data-action="next">›</button>
                    </div>
                    <h1 id="periodTitle" class="font-display text-xl font-bold hidden sm:block"></h1>
                </div>

                <div id="viewSwitcher" class="hidden md:flex gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl"></div>

                <div class="flex items-center gap-2">
                    <button class="icon-btn" data-action="search">⌕</button>
                    <button class="icon-btn" id="themeIcon" data-action="theme">☾</button>
                    <button class="icon-btn" id="profileBtn" title="Edit Profile">👤</button>
                    <button class="avatar" id="avatarBtn">CS</button>
                    <span id="avatarText" class="hidden"></span>
                </div>
            </header>

            <div class="md:hidden p-2 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#12121b]">
                <div id="mobileViewSwitcher" class="flex gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl"></div>
            </div>

            <div class="px-6 py-2 text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-white/5 bg-white dark:bg-[#12121b]">
                <span id="focusInsight"></span>
            </div>

            <div class="flex-1 overflow-auto bg-white dark:bg-[#0a0a12] calendar-shell">
                <div id="calendarView" class="min-h-full"></div>
            </div>
        </main>
    </div>

    <div id="modalRoot"></div>
    <div id="toastRoot" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none"></div>
    
    <input type="file" id="importFile" hidden accept=".json,.ics">

    <script src="/assets/script.js"></script>
    <script>
        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('chrona_user');
            localStorage.removeItem('chrona_profile');
            location.reload();
        });
        document.getElementById('profileBtn').addEventListener('click', () => {
            if (typeof openProfileModal === 'function') openProfileModal();
        });
        document.getElementById('avatarBtn').addEventListener('click', () => {
            if (typeof openProfileModal === 'function') openProfileModal();
        });
    </script>
</body>
</html>`;

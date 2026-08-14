// worker.js
import { HTML_PAGE } from './src/app.js';
import {
    handleRegister,
    handleLogin,
    handleGetEvents,
    handleCreateEvent,
    handleUpdateEvent,
    handleDeleteEvent,
    handleGetEventsByDate,
    handleGetDashboard,
    handleAdminGetUsers,
    handleAdminDeleteUser,
    handleAdminToggleAdmin,
    handleAdminGetAllEvents,
    handleUpdateProfile,
    handleUpdatePassword,
    getAllUsers,
} from './src/handlers.js';
import { jsonResponse } from './src/helpers.js';

const GITHUB_CSS_URL = 'https://raw.githubusercontent.com/bergham123/style-js/refs/heads/main/chroma/style.css';
const GITHUB_JS_URL = 'https://raw.githubusercontent.com/bergham123/style-js/refs/heads/main/chroma/script.js';

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;

        if (method === "OPTIONS") {
            return new Response(null, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, X-Username",
                },
            });
        }

        try {
            if (path === '/assets/style.css' && method === 'GET') {
                const res = await fetch(GITHUB_CSS_URL);
                if (!res.ok) return jsonResponse({ error: 'Failed to fetch CSS' }, 502);
                return new Response(await res.text(), { headers: { 'Content-Type': 'text/css; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
            }

            if (path === '/assets/script.js' && method === 'GET') {
                const res = await fetch(GITHUB_JS_URL);
                if (!res.ok) return jsonResponse({ error: 'Failed to fetch JS' }, 502);
                return new Response(await res.text(), { headers: { 'Content-Type': 'application/javascript; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
            }

            if ((path === '/' || path === '/ui') && method === 'GET') {
                return new Response(HTML_PAGE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
            }

            // المصادقة
            if (path === '/auth/register' && method === 'POST') return handleRegister(request, env);
            if (path === '/auth/login' && method === 'POST') return handleLogin(request, env);

            // المسارات المحمية
            const username = request.headers.get('X-Username');
            if (!username && (path.startsWith('/events') || path.startsWith('/dashboard') || path.startsWith('/admin') || path.startsWith('/user'))) {
                return jsonResponse({ error: 'Authentication required' }, 401);
            }

            // الأحداث
            if (path === '/events' && method === 'GET') return handleGetEvents(request, env, username);
            if (path === '/events' && method === 'POST') return handleCreateEvent(request, env, username);
            if (path.startsWith('/events/') && method === 'PUT') return handleUpdateEvent(request, env, username, path.split('/')[2]);
            if (path.startsWith('/events/') && method === 'DELETE') return handleDeleteEvent(request, env, username, path.split('/')[2]);
            if (path.startsWith('/events/date/') && method === 'GET') return handleGetEventsByDate(request, env, path.split('/')[3]);
            if (path.startsWith('/dashboard/') && method === 'GET') return handleGetDashboard(request, env, path.split('/')[2]);

            // الملف الشخصي
            if (path === '/user/profile' && method === 'PUT') return handleUpdateProfile(request, env, username);
            if (path === '/user/password' && method === 'PUT') return handleUpdatePassword(request, env, username);

            // المدير
            if (path.startsWith('/admin/')) {
                const users = await getAllUsers(env);
                const user = users[username];
                if (!user || !user.isAdmin) return jsonResponse({ error: 'Forbidden' }, 403);

                if (path === '/admin/users' && method === 'GET') return handleAdminGetUsers(request, env);
                if (path.startsWith('/admin/users/') && method === 'DELETE') return handleAdminDeleteUser(request, env, path.split('/')[3]);
                if (path.startsWith('/admin/users/') && path.endsWith('/admin') && method === 'PUT') return handleAdminToggleAdmin(request, env, path.split('/')[3]);
                if (path === '/admin/events' && method === 'GET') return handleAdminGetAllEvents(request, env);
            }

            return jsonResponse({ error: 'Not found' }, 404);
        } catch (error) {
            console.error('❌ Error:', error);
            return jsonResponse({ error: error.message || 'Internal server error' }, 500);
        }
    },
};

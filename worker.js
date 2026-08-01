// ================================================================
// الملف الرئيسي للـ Worker
// ================================================================

import { HTML_PAGE } from './src/app.js';
import {
    handleRegister,
    handleLogin,
    handleGetTasks,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
    handleGetJobsByDate,
    handleGetDashboard,
} from './src/handlers.js';
import { jsonResponse } from './src/helpers.js';

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;

        // معالجة طلبات CORS
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
            // ===== واجهة المستخدم =====
            if ((path === '/' || path === '/ui') && method === 'GET') {
                return new Response(HTML_PAGE, {
                    headers: { 'Content-Type': 'text/html; charset=utf-8' },
                });
            }

            // ===== مسارات API العامة =====

            // POST /auth/register
            if (path === '/auth/register' && method === 'POST') {
                return await handleRegister(request, env);
            }

            // POST /auth/login
            if (path === '/auth/login' && method === 'POST') {
                return await handleLogin(request, env);
            }

            // ===== مسارات API المحمية (تتطلب X-Username) =====
            const username = request.headers.get('X-Username');
            if (!username && (path.startsWith('/tasks') || path.startsWith('/dashboard'))) {
                return jsonResponse({ error: 'الرجاء تسجيل الدخول أولاً' }, 401);
            }

            // GET /tasks
            if (path === '/tasks' && method === 'GET') {
                return await handleGetTasks(request, env, username);
            }

            // POST /tasks
            if (path === '/tasks' && method === 'POST') {
                return await handleCreateTask(request, env, username);
            }

            // PUT /tasks/:id
            if (path.startsWith('/tasks/') && method === 'PUT') {
                const taskId = path.split('/')[2];
                return await handleUpdateTask(request, env, username, taskId);
            }

            // DELETE /tasks/:id
            if (path.startsWith('/tasks/') && method === 'DELETE') {
                const taskId = path.split('/')[2];
                return await handleDeleteTask(request, env, username, taskId);
            }

            // GET /jobs/:date (عام، لا يحتاج مصادقة)
            if (path.startsWith('/jobs/') && method === 'GET') {
                const date = path.split('/')[2];
                return await handleGetJobsByDate(request, env, date);
            }

            // GET /dashboard/:username (عام)
            if (path.startsWith('/dashboard/') && method === 'GET') {
                const user = path.split('/')[2];
                return await handleGetDashboard(request, env, user);
            }

            // ===== 404 =====
            return jsonResponse({ error: 'المسار غير موجود' }, 404);

        } catch (error) {
            console.error('❌ Error:', error);
            return jsonResponse({ error: error.message || 'خطأ داخلي في الخادم' }, 500);
        }
    },
};

// ================================================================
// الملف الرئيسي للـ Worker
// ================================================================

import { HTML_PAGE } from './src/app.js';
import {
    handleRegister,
    handleLogin,
    handleVerify,
    handleRequestReset,
    handleResetPassword,
    handleGetTasks,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
    handleGetJobsByDate,
    handleGetDashboard,
    handleAdminGetUsers,
    handleAdminDeleteUser,
    handleAdminToggleAdmin,
    handleAdminGetAllTasks,
} from './src/handlers.js';
import { jsonResponse } from './src/helpers.js';

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;

        // CORS
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

            // ===== مسارات المصادقة العامة =====
            if (path === '/auth/register' && method === 'POST') return handleRegister(request, env);
            if (path === '/auth/login' && method === 'POST') return handleLogin(request, env);
            if (path === '/auth/verify' && method === 'POST') return handleVerify(request, env);
            if (path === '/auth/reset-request' && method === 'POST') return handleRequestReset(request, env);
            if (path === '/auth/reset' && method === 'POST') return handleResetPassword(request, env);

            // ===== المهام (تتطلب X-Username) =====
            const username = request.headers.get('X-Username');
            if (!username && (path.startsWith('/tasks') || path.startsWith('/dashboard') || path.startsWith('/admin'))) {
                return jsonResponse({ error: 'الرجاء تسجيل الدخول أولاً' }, 401);
            }

            // مسارات المهام
            if (path === '/tasks' && method === 'GET') return handleGetTasks(request, env, username);
            if (path === '/tasks' && method === 'POST') return handleCreateTask(request, env, username);
            if (path.startsWith('/tasks/') && method === 'PUT') {
                const taskId = path.split('/')[2];
                return handleUpdateTask(request, env, username, taskId);
            }
            if (path.startsWith('/tasks/') && method === 'DELETE') {
                const taskId = path.split('/')[2];
                return handleDeleteTask(request, env, username, taskId);
            }

            // المهام حسب التاريخ
            if (path.startsWith('/jobs/') && method === 'GET') {
                const date = path.split('/')[2];
                return handleGetJobsByDate(request, env, date);
            }

            // لوحة تحكم المستخدم
            if (path.startsWith('/dashboard/') && method === 'GET') {
                const user = path.split('/')[2];
                return handleGetDashboard(request, env, user);
            }

            // ===== مسارات المشرف (تتطلب صلاحية) =====
            if (path.startsWith('/admin/')) {
                // التحقق من صلاحية المشرف
                const users = await import('./src/handlers.js').then(m => m.getAllUsers(env));
                const user = users[username];
                if (!user || !user.isAdmin) {
                    return jsonResponse({ error: 'غير مصرح به' }, 403);
                }

                if (path === '/admin/users' && method === 'GET') return handleAdminGetUsers(request, env);
                if (path.startsWith('/admin/users/') && method === 'DELETE') {
                    const userToDelete = path.split('/')[3];
                    return handleAdminDeleteUser(request, env, userToDelete);
                }
                if (path.startsWith('/admin/users/') && path.endsWith('/admin') && method === 'PUT') {
                    const userToToggle = path.split('/')[3];
                    return handleAdminToggleAdmin(request, env, userToToggle);
                }
                if (path === '/admin/tasks' && method === 'GET') return handleAdminGetAllTasks(request, env);
            }

            return jsonResponse({ error: 'المسار غير موجود' }, 404);
        } catch (error) {
            console.error('❌ Error:', error);
            return jsonResponse({ error: error.message || 'خطأ داخلي' }, 500);
        }
    },
};

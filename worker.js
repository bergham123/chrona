// ================================================================
// worker.js
// ================================================================

import { HTML_PAGE } from './src/app.js';
import { JS_CODE } from './src/script.js';
import {
    handleRegister,
    handleLogin,
    handleVerify,
    handleRequestReset,
    handleResetPassword,
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
    getAllUsers,
} from './src/handlers.js';
import { jsonResponse } from './src/helpers.js';

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
            if (path === '/ui/script.js' && method === 'GET') {
                return new Response(JS_CODE, {
                    headers: { 'Content-Type': 'application/javascript; charset=utf-8' },
                });
            }

            if ((path === '/' || path === '/ui') && method === 'GET') {
                return new Response(HTML_PAGE, {
                    headers: { 'Content-Type': 'text/html; charset=utf-8' },
                });
            }

            if (path === '/auth/register' && method === 'POST') return handleRegister(request, env);
            if (path === '/auth/login' && method === 'POST') return handleLogin(request, env);
            if (path === '/auth/verify' && method === 'POST') return handleVerify(request, env);
            if (path === '/auth/reset-request' && method === 'POST') return handleRequestReset(request, env);
            if (path === '/auth/reset' && method === 'POST') return handleResetPassword(request, env);

            const username = request.headers.get('X-Username');
            if (!username && (path.startsWith('/events') || path.startsWith('/dashboard') || path.startsWith('/admin'))) {
                return jsonResponse({ error: 'Authentication required' }, 401);
            }

            if (path === '/events' && method === 'GET') return handleGetEvents(request, env, username);
            if (path === '/events' && method === 'POST') return handleCreateEvent(request, env, username);
            
            if (path.startsWith('/events/') && method === 'PUT') {
                const eventId = path.split('/')[2];
                return handleUpdateEvent(request, env, username, eventId);
            }
            
            if (path.startsWith('/events/') && method === 'DELETE') {
                const eventId = path.split('/')[2];
                return handleDeleteEvent(request, env, username, eventId);
            }

            if (path.startsWith('/events/date/') && method === 'GET') {
                const date = path.split('/')[3];
                return handleGetEventsByDate(request, env, date);
            }

            if (path.startsWith('/dashboard/') && method === 'GET') {
                const user = path.split('/')[2];
                return handleGetDashboard(request, env, user);
            }

            if (path.startsWith('/admin/')) {
                const users = await getAllUsers(env);
                const user = users[username];
                if (!user || !user.isAdmin) {
                    return jsonResponse({ error: 'Forbidden' }, 403);
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
                
                if (path === '/admin/events' && method === 'GET') return handleAdminGetAllEvents(request, env);
            }

            return jsonResponse({ error: 'Not found' }, 404);
        } catch (error) {
            console.error('❌ Error:', error);
            return jsonResponse({ error: error.message || 'Internal server error' }, 500);
        }
    },
};

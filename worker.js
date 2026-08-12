// ================================================================
// worker.js - Main Entry Point & Router
// ================================================================

import { HTML_PAGE } from "./src/app.js";
import {
  handleRegister,
  handleLogin,
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
  handleUpdateProfile,
  handleUpdatePassword,
  getAllUsers,
} from "./src/handlers.js";
import { jsonResponse } from "./src/helpers.js";

const GITHUB_CSS_URL =
  "https://raw.githubusercontent.com/bergham123/style-js/refs/heads/main/chroma/style.css";
const GITHUB_JS_URL =
  "https://raw.githubusercontent.com/bergham123/style-js/refs/heads/main/chroma/script.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // ====== CORS Preflight ======
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
      // ====== Static Assets ======
      if (path === "/assets/style.css" && method === "GET") {
        const res = await fetch(GITHUB_CSS_URL);
        if (!res.ok)
          return jsonResponse({ error: "Failed to fetch CSS" }, 502);
        return new Response(await res.text(), {
          headers: {
            "Content-Type": "text/css; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      }

      if (path === "/assets/script.js" && method === "GET") {
        const res = await fetch(GITHUB_JS_URL);
        if (!res.ok)
          return jsonResponse({ error: "Failed to fetch JS" }, 502);
        return new Response(await res.text(), {
          headers: {
            "Content-Type": "application/javascript; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      }

      // ====== HTML Page ======
      if ((path === "/" || path === "/ui") && method === "GET") {
        return new Response(HTML_PAGE, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      }

      // ====== Public Authentication Routes ======
      if (path === "/auth/register" && method === "POST") {
        return handleRegister(request, env);
      }
      if (path === "/auth/login" && method === "POST") {
        return handleLogin(request, env);
      }
      if (path === "/auth/reset-request" && method === "POST") {
        return handleRequestReset(request, env);
      }
      if (path === "/auth/reset" && method === "POST") {
        return handleResetPassword(request, env);
      }

      // ====== Protected Routes - Check Authentication ======
      const username = request.headers.get("X-Username");
      if (
        !username &&
        (path.startsWith("/events") ||
          path.startsWith("/dashboard") ||
          path.startsWith("/admin") ||
          path.startsWith("/user"))
      ) {
        return jsonResponse({ error: "Authentication required" }, 401);
      }

      // ====== Events Routes ======
      if (path === "/events" && method === "GET") {
        return handleGetEvents(request, env, username);
      }
      if (path === "/events" && method === "POST") {
        return handleCreateEvent(request, env, username);
      }
      if (path.startsWith("/events/") && method === "PUT") {
        const eventId = path.split("/")[2];
        return handleUpdateEvent(request, env, username, eventId);
      }
      if (path.startsWith("/events/") && method === "DELETE") {
        const eventId = path.split("/")[2];
        return handleDeleteEvent(request, env, username, eventId);
      }
      if (path.startsWith("/events/date/") && method === "GET") {
        const date = path.split("/")[3];
        return handleGetEventsByDate(request, env, date);
      }

      // ====== Dashboard Routes ======
      if (path.startsWith("/dashboard/") && method === "GET") {
        const dashboardUsername = path.split("/")[2];
        return handleGetDashboard(request, env, dashboardUsername);
      }

      // ====== User Profile Routes ======
      if (path === "/user/profile" && method === "PUT") {
        return handleUpdateProfile(request, env, username);
      }
      if (path === "/user/password" && method === "PUT") {
        return handleUpdatePassword(request, env, username);
      }

      // ====== Admin Routes ======
      if (path.startsWith("/admin/")) {
        // تحقق من أن المستخدم مشرف
        const users = await getAllUsers(env);
        const user = users[username];
        if (!user || !user.isAdmin) {
          return jsonResponse({ error: "Forbidden" }, 403);
        }

        if (path === "/admin/users" && method === "GET") {
          return handleAdminGetUsers(request, env);
        }
        if (path.startsWith("/admin/users/") && method === "DELETE") {
          const deleteUsername = path.split("/")[3];
          return handleAdminDeleteUser(request, env, deleteUsername);
        }
        if (
          path.startsWith("/admin/users/") &&
          path.endsWith("/admin") &&
          method === "PUT"
        ) {
          const toggleUsername = path.split("/")[3];
          return handleAdminToggleAdmin(request, env, toggleUsername);
        }
        if (path === "/admin/events" && method === "GET") {
          return handleAdminGetAllEvents(request, env);
        }
      }

      // ====== 404 Not Found ======
      return jsonResponse({ error: "Not found" }, 404);
    } catch (error) {
      console.error("❌ Error:", error);
      return jsonResponse(
        { error: error.message || "Internal server error" },
        500
      );
    }
  },
};

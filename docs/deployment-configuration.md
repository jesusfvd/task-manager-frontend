# Deployment Configuration Matrix

This document describes the configuration for different environments.

## Environment Configuration

| Environment | Frontend URL | Backend URL | VITE_API_URL | CORS_ORIGIN (Backend) |
|---|---|---|---|---|
| Local Development | http://localhost:5173 | http://localhost:3000 | http://localhost:3000/api | http://localhost:5173 |
| Production (Render) | https://[fe-service].onrender.com | https://[be-service].onrender.com | https://[be-service].onrender.com/api | https://[fe-service].onrender.com |

## Key Points

1. **VITE_API_URL**: Must be set at build time for the frontend. This is embedded in the built assets.
2. **CORS_ORIGIN**: Backend environment variable that must match the exact frontend URL (no /api, no trailing /)
3. **SPA Routing**: render.yaml rewrites all routes (/*) to /index.html, enabling client-side routing
4. **Bearer Tokens**: All API requests include `Authorization: Bearer <token>` header
5. **Session Storage**: Authentication tokens are stored in sessionStorage (per-tab isolation)

## Deployment Steps

1. Frontend: Set `VITE_API_URL` environment variable in Render
2. Backend: Set `CORS_ORIGIN` environment variable in Render to exact Frontend URL
3. Backend: Ensure MongoDB Atlas connection is working (/health/database returns 200)
4. Test deep routes on deployed frontend (/ , /login, /register, /tasks, /tasks/:id)
5. Manual acceptance testing with multiple user roles

## Example Render URLs

- Frontend: `https://task-manager-frontend-abc123.onrender.com`
- Backend: `https://task-manager-backend-xyz789.onrender.com`
- VITE_API_URL: `https://task-manager-backend-xyz789.onrender.com/api`
- CORS_ORIGIN: `https://task-manager-frontend-abc123.onrender.com`

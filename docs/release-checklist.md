# Release Checklist - v1.0.0

## Quality Checks

- [x] All automated tests pass (9/9): `pnpm test`
- [x] ESLint validation passes: `pnpm lint` → 0 errors
- [x] Production build succeeds: `pnpm build` → dist folder created
- [x] No TypeScript errors: `tsc -b` passes without errors
- [x] No console errors in development mode (`pnpm dev`)
- [x] No console errors after production build review

## Production Configuration

- [x] `.env.production.example` created and committed
- [x] `render.yaml` created with static SPA configuration
- [x] `docs/deployment-configuration.md` created with environment matrix
- [x] `.gitignore` updated to ignore `.env`, `.env.local`, `.env.production`
- [x] `.env.test` created for test environment

## Deployment Verification

- [ ] Frontend deployed to Render (Blueprint created from render.yaml)
- [ ] `VITE_API_URL` environment variable set in Render to backend URL
- [ ] Frontend HTTPS URL obtained from Render
- [ ] Backend `CORS_ORIGIN` updated to exact frontend URL
- [ ] Backend health endpoints responding (GET /health, /health/database)
- [ ] Frontend deep routes rewriting correctly (/, /login, /register, /tasks, /tasks/:id)
- [ ] Frontend build logs show success in Render dashboard

## User Acceptance Testing

### Visitor (Unauthenticated)
- [ ] Can access registration page (/register)
- [ ] Can register new account (email, password, name validation)
- [ ] Can login with registered credentials
- [ ] Automatic session restore works after page reload
- [ ] Can logout (token cleared, redirected to home)
- [ ] Cannot access /tasks without authentication
- [ ] 404 page works for unknown routes

### User Role (Non-Admin)
- [ ] Can view task list
- [ ] Can create new tasks
- [ ] Can edit own tasks
- [ ] **Cannot see Delete button** on any task
- [ ] Attempting DELETE /api/tasks/:id returns 403 Forbidden
- [ ] 403 response shows error but user stays authenticated

### Admin Role
- [ ] Can view task list
- [ ] Can create new tasks
- [ ] Can edit own tasks
- [ ] **Can see Delete button** on all tasks
- [ ] Can delete tasks successfully (204 No Content response)
- [ ] Task removed from list after deletion
- [ ] Task count decreases after deletion

## Error Scenarios

- [ ] 401 Unauthorized: Token cleared, user logged out automatically
- [ ] 403 Forbidden: Error message shown, user stays authenticated
- [ ] Network failure: App shows error, doesn't crash
- [ ] CORS blocked: API calls fail with CORS error (cross-origin issue visible)
- [ ] Empty filters: Tasks list shows all when no filter applied
- [ ] Form validation: Email, password, name fields validate correctly

## Security Verification

- [ ] No MONGODB_URI in git history: `git log -p | grep MONGODB_URI` returns nothing
- [ ] No JWT_SECRET in git history: `git log -p | grep JWT_SECRET` returns nothing
- [ ] No access tokens in git history: `git log -p | grep Bearer` returns nothing
- [ ] No environment secrets committed
- [ ] sessionStorage used (not localStorage)
- [ ] HTTPS only in production
- [ ] CORS whitelist properly configured

## Documentation

- [x] README.md updated with all sections
- [x] CHANGELOG.md created with v1.0.0 entry
- [x] Deployment configuration documented
- [x] Smoke test script created
- [x] Test suite documented
- [x] Features and limitations listed

## Release Finalization

- [ ] All checklist items verified ✓
- [ ] Git working tree clean: `git status` shows no uncommitted changes
- [ ] All A12 files committed: `git add .` && `git commit -m "feat(a12): ..."`
- [ ] Tag created: `git tag -a v1.0.0 -m "Release v1.0.0"`
- [ ] Tag pushed: `git push origin v1.0.0`
- [ ] Verify tag points to correct commit: `git rev-list -n 1 v1.0.0`
- [ ] Branch pushed to GitHub: `git push -u origin ec3-a12-pruebas-despliegue`

## Sign-Off

- **Release Manager**: _____________________ Date: _____
- **QA Verification**: _____________________ Date: _____
- **Security Review**: _____________________ Date: _____

---

## Notes

- All tests must pass before release
- Production deployment must be validated
- User acceptance testing required for all roles
- Security checklist must be 100% complete
- Documentation must be current and accurate

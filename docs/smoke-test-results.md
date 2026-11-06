# Smoke Test Results - Production Deployment

**Test Date**: [To be filled by tester]  
**Frontend URL**: https://[frontend-service].onrender.com  
**Backend URL**: https://[backend-service].onrender.com  
**Tester**: [Your name]

## Test Execution

Run the smoke test:
```bash
FRONTEND_URL=https://[frontend-service].onrender.com \
BACKEND_URL=https://[backend-service].onrender.com \
pnpm smoke:production
```

## Results Summary

| Test | Expected | Actual | Status |
|------|----------|--------|--------|
| Frontend / | 200, contains `<div id="root">` | | ✓/✗ |
| Frontend /login | 200, contains `<div id="root">` | | ✓/✗ |
| Frontend /register | 200, contains `<div id="root">` | | ✓/✗ |
| Frontend /tasks | 200, contains `<div id="root">` | | ✓/✗ |
| Frontend /tasks/123 | 200, contains `<div id="root">` | | ✓/✗ |
| Backend /health | 200 JSON, status: ok | | ✓/✗ |
| Backend /health/database | 200 JSON, status: ok | | ✓/✗ |

## Overall Result
- **Total Tests**: 7
- **Passed**: ___ / 7
- **Failed**: ___ / 7
- **Status**: ✅ PASS / ❌ FAIL

## Notes
[Add any observations, errors, or issues encountered]

---

**Verified by**: _____________________ Date: _____

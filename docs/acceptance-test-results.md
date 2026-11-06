# User Acceptance Testing Results - A12

**Test Date**: [To be filled]  
**Frontend URL**: https://[frontend-service].onrender.com  
**Backend URL**: https://[backend-service].onrender.com  
**Tester**: [Your name]  
**Environment**: Production

---

## Visitor Role (Unauthenticated User)

### Registration & Login Flow
| Scenario | Expected | Result | Status |
|----------|----------|--------|--------|
| Access /register without auth | Registration form displays | | ✓/✗ |
| Register with valid data | User created, redirects to /login | | ✓/✗ |
| Register validation (email format) | Rejects invalid email | | ✓/✗ |
| Register validation (password ≥15 chars) | Rejects short password | | ✓/✗ |
| Login with correct credentials | Session created, redirects to /tasks | | ✓/✗ |
| Login with wrong credentials | Error message, no redirect | | ✓/✗ |

### Session Management
| Scenario | Expected | Result | Status |
|----------|----------|--------|--------|
| Session restore on reload | User stays logged in | | ✓/✗ |
| Token stored in sessionStorage | Not localStorage, not cookies | | ✓/✗ |
| Logout button clears token | sessionStorage cleaned, redirects to / | | ✓/✗ |
| Protected route access (/tasks) | Redirects to /login | | ✓/✗ |

### Error Handling
| Scenario | Expected | Result | Status |
|----------|----------|--------|--------|
| 404 page for unknown routes | 404 component displays | | ✓/✗ |

---

## User Role (Regular User, NOT admin)

### CRUD Operations
| Scenario | Expected | Result | Status |
|----------|----------|--------|--------|
| View tasks list | Tasks displayed | | ✓/✗ |
| Create new task | Task created, appears in list | | ✓/✗ |
| Edit own task | Task updated successfully | | ✓/✗ |
| Delete button visibility | **NO delete button shown** | | ✓/✗ |
| Attempt DELETE via API | 403 Forbidden response | | ✓/✗ |

### Error Scenarios
| Scenario | Expected | Result | Status |
|----------|----------|--------|--------|
| 403 response | Error shown, user stays logged in | | ✓/✗ |
| Network failure | Error message, app doesn't crash | | ✓/✗ |

---

## Admin Role (Administrator)

### CRUD Operations with Delete
| Scenario | Expected | Result | Status |
|----------|----------|--------|--------|
| View tasks list | Tasks displayed | | ✓/✗ |
| Create new task | Task created, appears in list | | ✓/✗ |
| Edit own task | Task updated successfully | | ✓/✗ |
| Delete button visibility | **Delete button visible on all tasks** | | ✓/✗ |
| Click delete button | Task removed from list, 204 response | | ✓/✗ |
| Task count decreases | Correct count after deletion | | ✓/✗ |

---

## Authorization & Security

### HTTP Status Codes
| Scenario | Expected | Result | Status |
|----------|----------|--------|--------|
| 401 Unauthorized | Token cleared, user logged out | | ✓/✗ |
| 403 Forbidden | Error shown, user stays authenticated | | ✓/✗ |
| 204 No Content | DELETE succeeds, no body returned | | ✓/✗ |

### Security
| Scenario | Expected | Result | Status |
|----------|----------|--------|--------|
| Token in Authorization header | `Bearer [token]` format | | ✓/✗ |
| CORS properly configured | No CORS errors in console | | ✓/✗ |
| No token in localStorage | Token only in sessionStorage | | ✓/✗ |

---

## Summary

### Visitor Testing
- **Total Scenarios**: 13
- **Passed**: ___ / 13
- **Failed**: ___ / 13
- **Status**: ✅ PASS / ❌ FAIL / ⚠️ PARTIAL

### User Role Testing
- **Total Scenarios**: 9
- **Passed**: ___ / 9
- **Failed**: ___ / 9
- **Status**: ✅ PASS / ❌ FAIL / ⚠️ PARTIAL

### Admin Role Testing
- **Total Scenarios**: 6
- **Passed**: ___ / 6
- **Failed**: ___ / 6
- **Status**: ✅ PASS / ❌ FAIL / ⚠️ PARTIAL

### Security & HTTP
- **Total Scenarios**: 8
- **Passed**: ___ / 8
- **Failed**: ___ / 8
- **Status**: ✅ PASS / ❌ FAIL / ⚠️ PARTIAL

---

## Overall Result

**Total Test Scenarios**: 36  
**Total Passed**: ___ / 36  
**Total Failed**: ___ / 36  
**Success Rate**: ____%

**ACCEPTANCE**: ✅ APPROVED / ❌ REJECTED

---

## Issues Found

| ID | Severity | Description | Impact |
|----|----------|-------------|--------|
| | High/Med/Low | | |

---

## Sign-Off

**Tester Name**: _____________________ Date: _____

**QA Manager**: _____________________ Date: _____

**Approved for Release**: ✅ YES / ❌ NO

---

## Notes

[Add any additional observations, environment details, or recommendations]

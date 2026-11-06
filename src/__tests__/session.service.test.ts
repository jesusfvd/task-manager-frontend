import { describe, it, expect, beforeEach, afterEach } from 'vitest';

const TOKEN_KEY = 'task-manager.access-token';
const CURRENT_USER_KEY = 'task-manager.current-user';

// Mock sessionStorage
const mockSessionStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

// Session service functions
const saveToken = (token: string): void => {
  sessionStorage.setItem(TOKEN_KEY, token);
};

const getToken = (): string | null => {
  return sessionStorage.getItem(TOKEN_KEY);
};

const clearToken = (): void => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(CURRENT_USER_KEY);
};

const setCurrentUser = (user: Record<string, unknown>): void => {
  sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

const getCurrentUser = (): Record<string, unknown> | null => {
  const user = sessionStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

describe('Session Service', () => {
  beforeEach(() => {
    mockSessionStorage.clear();
  });

  afterEach(() => {
    mockSessionStorage.clear();
  });

  it('Test 1: saveToken() stores token in sessionStorage with TOKEN_KEY', () => {
    const token = 'test-jwt-token-12345';
    saveToken(token);
    expect(mockSessionStorage.getItem(TOKEN_KEY)).toBe(token);
  });

  it('Test 2: getToken() retrieves token from sessionStorage', () => {
    const token = 'test-jwt-token-12345';
    mockSessionStorage.setItem(TOKEN_KEY, token);
    expect(getToken()).toBe(token);
  });

  it('Test 3: clearToken() removes token and current user from sessionStorage', () => {
    const token = 'test-jwt-token-12345';
    const user = { id: '1', name: 'Test User', email: 'test@example.com' };

    mockSessionStorage.setItem(TOKEN_KEY, token);
    mockSessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

    clearToken();

    expect(mockSessionStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(mockSessionStorage.getItem(CURRENT_USER_KEY)).toBeNull();
  });

  it('Test 4: getCurrentUser() returns stored user object', () => {
    const user = { id: '1', name: 'Test User', email: 'test@example.com', role: 'user' };
    setCurrentUser(user);
    expect(getCurrentUser()).toEqual(user);
  });
});

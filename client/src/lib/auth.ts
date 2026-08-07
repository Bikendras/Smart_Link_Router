export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  role?: 'user' | 'admin';
};

export function saveSession(token: string, user?: AuthUser | null) {
  localStorage.setItem('authToken', token);
  localStorage.removeItem('adminSecret');
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
    if (user.email) localStorage.setItem('userEmail', user.email);
    if (user.name) localStorage.setItem('userName', user.name || '');
  }
}

export function clearSession() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('adminSecret');
  localStorage.removeItem('user');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
}

export function getToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('authToken') || '';
}

export function getUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return Boolean(getToken());
}

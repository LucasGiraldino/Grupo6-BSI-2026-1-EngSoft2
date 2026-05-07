import api from '../services/api';

interface DecodedToken {
  sub: string;
  perfil: string;
  exp: number;
}

const decodeJwt = (token: string): DecodedToken | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export function useAuth() {
  const token = localStorage.getItem('token');
  let isAuth = false;
  let isAdm = false;
  let userEmail: string | null = null;

  if (token) {
    const decoded = decodeJwt(token);
    if (decoded && decoded.exp * 1000 > Date.now()) {
      isAuth = true;
      isAdm = decoded.perfil === 'ADMINISTRADOR';
      userEmail = decoded.sub;
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  }

  const login = (jwt: string, refreshToken?: string) => {
    localStorage.setItem('token', jwt);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    window.location.href = '/dashboard';
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
  };

  return {
    isAuthenticated: isAuth,
    isAdmin: isAdm,
    email: userEmail,
    login,
    logout
  };
}

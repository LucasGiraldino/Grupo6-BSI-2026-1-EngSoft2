interface DecodedToken {
  sub: string;
  perfil: string;
  exp: number;
}

const decodeJwt = (token: string): DecodedToken | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
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
    }
  }

  const login = (jwt: string) => {
    localStorage.setItem('token', jwt);
    window.location.href = '/dashboard';
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return {
    isAuthenticated: isAuth,
    isAdmin: isAdm,
    email: userEmail,
    login,
    logout
  };
}

import { useState, useEffect } from 'react';

const ADMIN_PASSCODE = '150206';
const AUTH_KEY = 'study_resources_admin_auth';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const stored = sessionStorage.getItem(AUTH_KEY);
      setIsAuthenticated(stored === 'true');
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (passcode: string): boolean => {
    if (passcode === ADMIN_PASSCODE) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout, loading };
};
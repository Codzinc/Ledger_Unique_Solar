import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { loginUser } from "../../../ApiComps/Auth/SignIn";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("access") && !!localStorage.getItem("refresh");
  });
  const [user, setUser] = useState(null);

  // Restore user info from token if needed (optional: decode JWT for user info)
  useEffect(() => {
    if (isAuthenticated && !user) {
      // Optionally, decode JWT to get user info here
      // For now, just set user as "restored"
      setUser({ restored: true });
    }
  }, [isAuthenticated, user]);

  const login = useCallback(async (credentials) => {
    const data = await loginUser(credentials);
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    setIsAuthenticated(true);
    setUser(data.user || {});
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

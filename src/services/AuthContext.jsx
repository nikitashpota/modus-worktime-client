import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  // Проверяем наличие токена при инициализации
  useEffect(() => {
    setUserId(null);
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("id");
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
      setUserId(id);
    }
  }, []);

  const login = (token, role, id) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("id", id);

    setIsAuthenticated(true);
    setUserRole(role);
    setUserId(id);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    setIsAuthenticated(false);
    setUserRole(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userRole, userId, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

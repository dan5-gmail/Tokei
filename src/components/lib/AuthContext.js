import React, { createContext, useContext, useState } from "react";

// @ts-ignore
const AuthContext = createContext();

// @ts-ignore
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const logout = () => {
    setUser(null);
  };

  const navigateToLogin = () => {
    console.log("Login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        logout,
        navigateToLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
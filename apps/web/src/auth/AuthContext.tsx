import { createContext, useEffect, useState } from "react";
import { getToken, setToken, clearToken } from "../utils/token";
import * as authApi from "../api/auth.api";

type AuthContextType = {
  user: any;
  isAuthenticated: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const token = getToken();

  useEffect(() => {
    if (token) {
      setUser({}); // optionally decode JWT later
    }
  }, [token]);

  async function login(data: any) {
    const res = await authApi.login(data);
    setToken(res.token);
    setUser(res.user);
  }

  async function register(data: any) {
    const res = await authApi.register(data);
    setToken(res.token);
    setUser(res.user);
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

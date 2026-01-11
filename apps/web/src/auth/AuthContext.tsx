import { createContext, useEffect, useState } from "react";
import { getToken, setToken, clearToken } from "../utils/token";
import * as authApi from "../api/auth.api";

type AuthContextType = {
  user: any;
  isAuthenticated: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<any>;
  verifyEmail: (data: any) => Promise<any>;
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
    const res = await authApi.loginWithCredentials(data);
    setToken(res.user.token);
   
    setUser(res.user);
  }

  async function verifyEmail(data: any) {
    const res = await authApi.verifyEmail(data);
    // After successful verification, we might want to auto-login or redirect
    // For now, we'll just return the result
    return res;
  }

  async function register(data: any) {
    const res = await authApi.register(data);
    setUser(res);
    return res;
  }

  async function logout() {
    try {
      // Call the logout API to clear server-side session/cookie
      await authApi.logout();
    } catch (error) {
      // Even if the API call fails, still clear the local token
      console.error('Logout API error:', error);
    } finally {
      // Clear the local token and user data
      clearToken();
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!token,
        login,
        register,
        verifyEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

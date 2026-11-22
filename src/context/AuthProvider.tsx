import { useState } from "react";
import type { ReactNode } from "react";
import { getSession, setSession } from "../api/session";
import { authRepository } from "../repositories/authRepository";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [session, updateSession] = useState(getSession);

  async function login(username: string, password: string) {
    const result = await authRepository.login(username, password);
    const next = { user: result, accessToken: result.accessToken };
    setSession(next);
    updateSession(next);
  }

  function logout() {
    setSession(null);
    updateSession(null);
  }

  return (
    <AuthContext
      value={{
        user: session?.user ?? null,
        accessToken: session?.accessToken ?? null,
        isAuthenticated: Boolean(session),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext>
  );
}

import { createContext } from "react";
import type { AuthUser } from "../types/auth";

interface AuthValue {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthValue | null>(null);

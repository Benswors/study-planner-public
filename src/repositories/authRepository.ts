import { request } from "../api/httpClient";
import type { AuthResponse, AuthUser } from "../types/auth";

export const authRepository = {
  login(username: string, password: string) {
    return request<AuthResponse>("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  },
  getCurrentUser(signal: AbortSignal) {
    return request<AuthUser>("/auth/me", { signal }, true);
  },
};

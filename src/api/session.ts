import type { AuthUser } from "../types/auth";

let session: { user: AuthUser; accessToken: string } | null = null;

export function getSession() {
  return session;
}

export function setSession(value: typeof session) {
  session = value;
}

import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { getSession } from "../api/session";

export function requireAuth({ request }: LoaderFunctionArgs) {
  if (getSession()) return null;

  const url = new URL(request.url);
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const path = url.pathname.slice(base.length) + url.search;
  return redirect(`/login?next=${encodeURIComponent(path)}`);
}

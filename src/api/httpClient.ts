import { getSession } from "./session";

const apiUrl = import.meta.env.VITE_API_URL || "https://dummyjson.com";

export async function request<T>(
  path: string,
  options: RequestInit = {},
  authenticated = false,
): Promise<T> {
  const headers = new Headers(options.headers);

  if (authenticated) {
    const session = getSession();
    if (!session) throw new Error("Увійдіть, щоб виконати цю дію.");
    headers.set("Authorization", `Bearer ${session.accessToken}`);
  }

  const response = await fetch(`${apiUrl.replace(/\/+$/, "")}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(
        "Не вдалося підтвердити вхід. Перевірте дані або увійдіть повторно.",
      );
    }
    throw new Error(`Сервер повернув помилку HTTP ${response.status}.`);
  }

  return response.json() as Promise<T>;
}

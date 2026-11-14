const apiUrl = import.meta.env.VITE_API_URL || 'https://dummyjson.com'

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiUrl.replace(/\/+$/, '')}${path}`, options)

  if (!response.ok) {
    throw new Error(`Сервер повернув помилку HTTP ${response.status}.`)
  }

  return response.json() as Promise<T>
}

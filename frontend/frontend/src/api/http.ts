const baseUrl = import.meta.env.VITE_API_BASE_URL as string;

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  console.log("API BASE URL:", baseUrl);
  console.log("Request:", `${baseUrl}${path}`);

  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}


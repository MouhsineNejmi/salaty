export async function refresh() {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function api<T>(
  path: string,
  options?: RequestInit & { data?: any; retry?: boolean }
): Promise<T> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    method: options?.method || 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    body: options?.data ? JSON.stringify(options.data) : undefined,
  });

  if (res.status === 401 && options?.retry !== false) {
    try {
      await refresh();

      // Retry once
      return api<T>(path, {
        ...options,
        retry: false, // Prevent infinite loop
      });
    } catch (e) {
      throw new Error('Session expired. Please log in again.');
    }
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.errors?.[0]?.message || data.message || 'Unexpected error'
    );
  }

  return data;
}

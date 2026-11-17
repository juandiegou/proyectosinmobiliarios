import { apiFetch, saveToken } from './api';

export async function loginAdmin(username: string, password: string): Promise<void> {
  const data = await apiFetch<{ access_token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  saveToken(data.access_token);
}

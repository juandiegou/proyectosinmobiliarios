import { apiFetch, clearToken, getRol, saveToken } from './api';

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  telefono?: string | null;
  rol: 'admin' | 'inmobiliaria' | 'asesor' | 'cliente';
  inmobiliaria_id?: string | null;
  comision_pct?: number | null;
  activo: boolean;
}

/** Inicia sesión con correo y contraseña (o con el usuario del administrador). Devuelve el rol. */
export async function iniciarSesion(usuario: string, password: string): Promise<string> {
  const data = await apiFetch<{ access_token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: usuario, password }),
  });
  saveToken(data.access_token);
  return getRol() ?? '';
}

export function cerrarSesion() {
  clearToken();
}

export function registrarCliente(body: { email: string; password: string; nombre: string; telefono?: string }) {
  return apiFetch('/usuarios/registro', { method: 'POST', body: JSON.stringify(body) });
}

export async function miPerfil(): Promise<Usuario> {
  const res = await apiFetch<{ data: Usuario }>('/usuarios/me');
  return res.data;
}

export async function actualizarPerfil(body: { nombre?: string; telefono?: string; password?: string }): Promise<Usuario> {
  const res = await apiFetch<{ data: Usuario }>('/usuarios/me', { method: 'PATCH', body: JSON.stringify(body) });
  return res.data;
}

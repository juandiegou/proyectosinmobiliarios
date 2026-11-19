import { apiFetch } from './api';
import type { Usuario } from './sesion';

export interface Inmobiliaria {
  id: string;
  nombre: string;
  activa: boolean;
}

export async function listarInmobiliarias(): Promise<Inmobiliaria[]> {
  const res = await apiFetch<{ data: Inmobiliaria[] }>('/admin/inmobiliarias');
  return res.data;
}

export interface NuevaInmobiliaria {
  nombre: string;
  email: string;
  password: string;
  nombre_responsable: string;
}

export function crearInmobiliaria(body: NuevaInmobiliaria) {
  return apiFetch('/admin/inmobiliarias', { method: 'POST', body: JSON.stringify(body) });
}

export function activarInmobiliaria(id: string, activa: boolean) {
  return apiFetch(`/admin/inmobiliarias/${id}`, { method: 'PATCH', body: JSON.stringify({ activa }) });
}

export async function listarUsuarios(rol?: string): Promise<Usuario[]> {
  const res = await apiFetch<{ data: Usuario[] }>(`/admin/usuarios${rol ? `?rol=${rol}` : ''}`);
  return res.data;
}

export function activarUsuario(id: string, activo: boolean) {
  return apiFetch(`/admin/usuarios/${id}`, { method: 'PATCH', body: JSON.stringify({ activo }) });
}

export function expirarSeparaciones() {
  return apiFetch<{ data: { vencidas: number } }>('/admin/expirar-separaciones', { method: 'POST' });
}

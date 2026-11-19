import { apiFetch } from './api';
import type { Property } from '@/types';
import type { Usuario } from './sesion';

export interface CondicionesSeparacion {
  monto: number;
  dias_vencimiento: number;
  devolucion_pct: number;
}

export interface NuevaPropiedad {
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  size_sqft: number;
  location: [number, number];
  terrain_type: string;
  is_offer: boolean;
  discount: number;
  description: string;
  separacion: CondicionesSeparacion;
}

export async function misPropiedades(): Promise<Property[]> {
  const res = await apiFetch<{ data: Property[] }>('/asesor/propiedades');
  return res.data;
}

export function publicarPropiedad(body: NuevaPropiedad) {
  return apiFetch('/asesor/propiedades', { method: 'POST', body: JSON.stringify(body) });
}

export function editarPropiedad(id: number, body: Partial<Pick<NuevaPropiedad, 'price' | 'description' | 'separacion'>>) {
  return apiFetch(`/asesor/propiedades/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
}

export async function listarAsesores(): Promise<Usuario[]> {
  const res = await apiFetch<{ data: Usuario[] }>('/inmobiliaria/asesores');
  return res.data;
}

export interface NuevoAsesor {
  email: string;
  password: string;
  nombre: string;
  telefono?: string;
  comision_pct: number;
}

export function crearAsesor(body: NuevoAsesor) {
  return apiFetch('/inmobiliaria/asesores', { method: 'POST', body: JSON.stringify(body) });
}

export function editarAsesor(id: string, body: { comision_pct?: number; activo?: boolean; nombre?: string }) {
  return apiFetch(`/inmobiliaria/asesores/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
}

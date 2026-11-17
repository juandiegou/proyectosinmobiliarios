import { apiFetch } from './api';

export type EstadoSolicitud = 'nueva' | 'contactada' | 'en_negociacion' | 'cerrada' | 'descartada';

export const ESTADOS: { value: EstadoSolicitud; label: string }[] = [
  { value: 'nueva', label: 'Nueva' },
  { value: 'contactada', label: 'Contactada' },
  { value: 'en_negociacion', label: 'En negociación' },
  { value: 'cerrada', label: 'Cerrada' },
  { value: 'descartada', label: 'Descartada' },
];

export interface Solicitud {
  id: string;
  property_id: number;
  nombre: string;
  contacto: string;
  mensaje?: string | null;
  estado: EstadoSolicitud;
  created_at: string;
}

export interface NuevaSolicitud {
  property_id: number;
  nombre: string;
  contacto: string;
  mensaje?: string;
}

export function crearSolicitud(body: NuevaSolicitud) {
  return apiFetch<{ detail: string }>('/solicitudes', { method: 'POST', body: JSON.stringify(body) });
}

export async function listarSolicitudes(): Promise<Solicitud[]> {
  const res = await apiFetch<{ data: Solicitud[] }>('/solicitudes');
  return res.data;
}

export function cambiarEstado(id: string, estado: EstadoSolicitud) {
  return apiFetch(`/solicitudes/${id}/estado`, { method: 'PATCH', body: JSON.stringify({ estado }) });
}

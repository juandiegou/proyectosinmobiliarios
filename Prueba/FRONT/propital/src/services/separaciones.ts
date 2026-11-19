import { apiFetch } from './api';

export type EstadoSeparacion = 'pendiente_pago' | 'vigente' | 'vencida' | 'cancelada' | 'convertida_venta';

export interface Separacion {
  id: string;
  property_id: number;
  cliente_id: string;
  asesor_id?: string | null;
  inmobiliaria_id?: string | null;
  monto: number;
  moneda?: string | null;
  devolucion_pct: number;
  comision_pct: number;
  comision_asesor: number;
  devuelto: number;
  estado: EstadoSeparacion;
  creada_en: string;
  vence_en?: string | null;
  pagado_en?: string | null;
}

export const ESTADOS_SEPARACION: Record<EstadoSeparacion, string> = {
  pendiente_pago: 'Pendiente de pago',
  vigente: 'Vigente',
  vencida: 'Vencida',
  cancelada: 'Cancelada',
  convertida_venta: 'Convertida en venta',
};

export async function separar(propertyId: number): Promise<Separacion> {
  const res = await apiFetch<{ data: Separacion }>('/separaciones', {
    method: 'POST',
    body: JSON.stringify({ property_id: propertyId }),
  });
  return res.data;
}

export async function listarSeparaciones(): Promise<Separacion[]> {
  const res = await apiFetch<{ data: Separacion[] }>('/separaciones');
  return res.data;
}

export async function pagarSeparacion(id: string): Promise<Separacion> {
  const res = await apiFetch<{ data: Separacion }>(`/separaciones/${id}/pagar`, { method: 'POST' });
  return res.data;
}

export async function cancelarSeparacion(id: string): Promise<Separacion> {
  const res = await apiFetch<{ data: Separacion }>(`/separaciones/${id}/cancelar`, { method: 'POST' });
  return res.data;
}

export async function venderSeparacion(id: string): Promise<Separacion> {
  const res = await apiFetch<{ data: Separacion }>(`/separaciones/${id}/vender`, { method: 'POST' });
  return res.data;
}

/** Monto con la moneda de la propiedad, si la separación la tiene. */
export function formatMonto(monto: number, moneda?: string | null): string {
  const numero = monto.toLocaleString('es-CO');
  return moneda ? `${numero} ${moneda}` : numero;
}

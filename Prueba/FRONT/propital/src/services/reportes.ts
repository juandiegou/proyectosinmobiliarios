import { apiFetch } from './api';

export interface FilaComision {
  asesor_id: string;
  asesor: string | null;
  separaciones: number;
  monto: number;
  comision_total: number;
}

export async function comisionesPorAsesor(desde?: string, hasta?: string): Promise<FilaComision[]> {
  const params = new URLSearchParams();
  if (desde) params.set('desde', desde);
  if (hasta) params.set('hasta', hasta);
  const qs = params.toString();
  const res = await apiFetch<{ data: FilaComision[] }>(`/reportes/comisiones${qs ? `?${qs}` : ''}`);
  return res.data;
}

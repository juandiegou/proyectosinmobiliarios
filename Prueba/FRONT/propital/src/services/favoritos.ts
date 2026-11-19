import { apiFetch } from './api';
import type { Property } from '@/types';

export function listarFavoritos(): Promise<{ data: Property[] }> {
  return apiFetch<{ data: Property[] }>('/favoritos');
}

export function agregarFavorito(propertyId: number) {
  return apiFetch(`/favoritos/${propertyId}`, { method: 'POST' });
}

export function quitarFavorito(propertyId: number) {
  return apiFetch(`/favoritos/${propertyId}`, { method: 'DELETE' });
}

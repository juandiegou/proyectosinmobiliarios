import { type PropertyStore } from '@/types';
import { create } from 'zustand';

export const usePropertyStore = create<PropertyStore>(set => ({
    property: {
      id: 0,
      address: '',
      price: 0,
      bedrooms: 0,
      bathrooms: 0,
      location: { latitude: 0, longitude: 0 },
      size_sqft: 0,
      terrain_type: '',
      is_offer: false,
      discount: 0,
      description: '',
      details: undefined,
      latitude: 0,
      longitude: 0
    },
}));

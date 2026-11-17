import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { obtenerTasas, type Tasas } from '@/services/currency';

interface CurrencyState {
  moneda: string;
  tasas: Tasas | null;
  setMoneda: (moneda: string) => void;
  cargarTasas: () => Promise<void>;
}

// La moneda elegida se guarda en localStorage y se mantiene al volver a la página.
export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      moneda: 'COP',
      tasas: null,
      setMoneda: (moneda) => set({ moneda }),
      cargarTasas: async () => {
        const tasas = await obtenerTasas();
        set({ tasas });
      },
    }),
    {
      name: 'moneda-preferida',
      partialize: (state) => ({ moneda: state.moneda }),
    }
  )
);

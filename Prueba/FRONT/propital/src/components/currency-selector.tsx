import { useEffect } from 'react';
import { MONEDAS } from '@/services/currency';
import { useCurrencyStore } from '@/store/currency-store';

export function CurrencySelector() {
  const moneda = useCurrencyStore((s) => s.moneda);
  const setMoneda = useCurrencyStore((s) => s.setMoneda);
  const cargarTasas = useCurrencyStore((s) => s.cargarTasas);
  const tasas = useCurrencyStore((s) => s.tasas);

  useEffect(() => {
    cargarTasas();
  }, [cargarTasas]);

  return (
    <div className='absolute z-10 top-3 right-3 bg-backgroundDark rounded-lg p-2 text-white text-sm'>
      <label htmlFor='selector-moneda' className='block mb-1'>Ver precios en</label>
      <select
        id='selector-moneda'
        name='moneda'
        value={moneda}
        onChange={(e) => setMoneda(e.target.value)}
        className='bg-backgroundDark border border-backgroundDark text-white rounded-lg p-1.5'
      >
        {MONEDAS.map((m) => (
          <option key={m.code} value={m.code}>{m.label}</option>
        ))}
      </select>
      {!tasas && <p className='text-xs mt-1 opacity-70'>Tasas no disponibles: se muestra el precio original.</p>}
    </div>
  );
}

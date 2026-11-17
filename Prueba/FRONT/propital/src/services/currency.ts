// Conversión de moneda con tasas de open.er-api.com (base USD, sin clave, actualizadas a diario).
const RATES_URL = 'https://open.er-api.com/v6/latest/USD';
const CACHE_KEY = 'tasas-cambio-v1';
const CACHE_MS = 60 * 60 * 1000; // 1 hora

export const MONEDAS = [
  { code: 'COP', label: 'Peso colombiano (COP)' },
  { code: 'USD', label: 'Dólar estadounidense (USD)' },
  { code: 'EUR', label: 'Euro (EUR)' },
  { code: 'MXN', label: 'Peso mexicano (MXN)' },
  { code: 'CAD', label: 'Dólar canadiense (CAD)' },
  { code: 'CLP', label: 'Peso chileno (CLP)' },
  { code: 'PEN', label: 'Sol peruano (PEN)' },
  { code: 'JPY', label: 'Yen japonés (JPY)' },
  { code: 'AUD', label: 'Dólar australiano (AUD)' },
  { code: 'AED', label: 'Dírham de EAU (AED)' },
];

export type Tasas = Record<string, number>;

export async function obtenerTasas(): Promise<Tasas | null> {
  try {
    const guardado = localStorage.getItem(CACHE_KEY);
    if (guardado) {
      const { fecha, tasas } = JSON.parse(guardado);
      if (Date.now() - fecha < CACHE_MS) return tasas;
    }
  } catch {
    /* caché corrupta: se vuelve a pedir */
  }
  try {
    const res = await fetch(RATES_URL);
    const json = await res.json();
    if (json.result !== 'success' || !json.rates) return null;
    localStorage.setItem(CACHE_KEY, JSON.stringify({ fecha: Date.now(), tasas: json.rates }));
    return json.rates as Tasas;
  } catch {
    return null;
  }
}

/** Convierte un monto entre dos monedas usando tasas por USD. Devuelve null si falta alguna tasa. */
export function convertir(monto: number, desde: string, hacia: string, tasas: Tasas): number | null {
  const tDesde = tasas[desde];
  const tHacia = tasas[hacia];
  if (!tDesde || !tHacia) return null;
  return (monto / tDesde) * tHacia;
}

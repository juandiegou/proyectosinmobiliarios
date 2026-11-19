import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Property } from '@/types';
import { formatPrice } from '@/services/property-service';
import { InteresForm } from './interes-form';
import type { Tasas } from '@/services/currency';
import { useSesion } from '@/hooks/use-sesion';
import { useToast } from '@/hooks';
import { agregarFavorito, listarFavoritos, quitarFavorito } from '@/services/favoritos';
import { separar } from '@/services/separaciones';
import { ApiError } from '@/services/api';
import { Spinner } from './loader';

interface Props {
  property: Property;
  onClose: () => void;
  monedaElegida: string;
  tasas: Tasas | null;
}

export function PropertyPanel({ property, onClose, monedaElegida, tasas }: Props) {
  const { rol, listo } = useSesion();
  const { addToast } = useToast();
  const [esFavorita, setEsFavorita] = useState(false);
  const [ocupado, setOcupado] = useState(false);

  const disponible = (property.estado ?? 'disponible') === 'disponible';
  const puedeSeparar = disponible && !!property.separacion?.monto;
  const esCliente = listo && rol === 'cliente';

  useEffect(() => {
    if (!esCliente) return;
    listarFavoritos()
      .then((res) => setEsFavorita(res.data.some((p) => p.id === property.id)))
      .catch(() => setEsFavorita(false));
  }, [esCliente, property.id]);

  async function alternarFavorita() {
    setOcupado(true);
    try {
      if (esFavorita) {
        await quitarFavorito(property.id);
        setEsFavorita(false);
      } else {
        await agregarFavorito(property.id);
        setEsFavorita(true);
      }
    } catch (e) {
      addToast(e instanceof ApiError ? e.message : 'No pudimos actualizar tus favoritos.', 'info');
    } finally {
      setOcupado(false);
    }
  }

  async function separarPropiedad() {
    setOcupado(true);
    try {
      await separar(property.id);
      addToast('Propiedad separada. Completa el pago en Mi cuenta antes de 24 horas.', 'info');
    } catch (e) {
      addToast(e instanceof ApiError ? e.message : 'No pudimos separar la propiedad.', 'info');
    } finally {
      setOcupado(false);
    }
  }

  const dato = (etiqueta: string, valor: string | number) => (
    <div className='flex justify-between gap-4 text-sm'>
      <span className='opacity-70'>{etiqueta}</span>
      <span className='text-right'>{valor}</span>
    </div>
  );

  const boton = 'rounded-lg p-2.5 text-sm font-medium disabled:opacity-60';

  return (
    <section className='w-full max-w-3xl mx-auto bg-backgroundDark text-white rounded-xl p-4 flex flex-col gap-4 md:flex-row'>
      <div className='flex flex-col gap-2 md:w-1/2 min-w-0'>
        <div className='flex justify-between items-start gap-2'>
          <h2 className='font-semibold text-base break-words'>{property.address}</h2>
          <button onClick={onClose} className='text-sm opacity-70 hover:opacity-100' aria-label='Cerrar'>✕</button>
        </div>
        {!disponible && <p className='text-amber-400 text-sm font-semibold'>No disponible ({property.estado})</p>}
        {property.is_offer && <p className='text-red-500 text-sm font-semibold'>En oferta{property.discount > 0 ? ` · ${property.discount}% de descuento` : ''}</p>}
        {dato('Precio', formatPrice(property.price, property.details?.moneda, monedaElegida, tasas))}
        {property.separacion?.monto && dato('Separación', property.separacion.monto.toLocaleString('es-CO'))}
        {dato('Habitaciones', property.bedrooms)}
        {dato('Baños', property.bathrooms)}
        {dato('Área', `${property.size_sqft} m²`)}
        {dato('Terreno', property.terrain_type)}
        <p className='text-sm opacity-80 break-words'>{property.description}</p>

        {listo && (
          <div className='flex flex-col gap-2 pt-2'>
            {esCliente ? (
              <>
                <button onClick={alternarFavorita} disabled={ocupado} className={`${boton} border border-white/30 hover:bg-white/10`}>
                  {ocupado && <Spinner />} {esFavorita ? '★ Quitar de favoritos' : '☆ Guardar en favoritos'}
                </button>
                {puedeSeparar && (
                  <button onClick={separarPropiedad} disabled={ocupado} className={`${boton} bg-blue-700 hover:bg-blue-800`}>
                    {ocupado && <Spinner />} Separar esta propiedad
                  </button>
                )}
                <Link href='/cuenta' className='text-sm underline opacity-80'>Ver mis favoritos y separaciones</Link>
              </>
            ) : rol ? null : (
              <Link href='/login' className='text-sm underline opacity-80'>Inicia sesión para guardar o separar</Link>
            )}
          </div>
        )}
      </div>
      <div className='md:w-1/2 min-w-0'>
        <h3 className='font-semibold text-sm mb-2'>¿Te interesa esta propiedad?</h3>
        <InteresForm propertyId={property.id} />
      </div>
    </section>
  );
}

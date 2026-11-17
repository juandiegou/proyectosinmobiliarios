import { Property } from '@/types';
import { formatPrice } from '@/services/property-service';
import { InteresForm } from './interes-form';
import type { Tasas } from '@/services/currency';

interface Props {
  property: Property;
  onClose: () => void;
  monedaElegida: string;
  tasas: Tasas | null;
}

export function PropertyPanel({ property, onClose, monedaElegida, tasas }: Props) {
  const dato = (etiqueta: string, valor: string | number) => (
    <div className='flex justify-between gap-4 text-sm'>
      <span className='opacity-70'>{etiqueta}</span>
      <span className='text-right'>{valor}</span>
    </div>
  );

  return (
    <section className='w-full max-w-3xl mx-auto bg-backgroundDark text-white rounded-xl p-4 flex flex-col gap-4 md:flex-row'>
      <div className='flex flex-col gap-2 md:w-1/2 min-w-0'>
        <div className='flex justify-between items-start gap-2'>
          <h2 className='font-semibold text-base break-words'>{property.address}</h2>
          <button onClick={onClose} className='text-sm opacity-70 hover:opacity-100' aria-label='Cerrar'>✕</button>
        </div>
        {property.is_offer && <p className='text-red-500 text-sm font-semibold'>En oferta{property.discount > 0 ? ` · ${property.discount}% de descuento` : ''}</p>}
        {dato('Precio', formatPrice(property.price, property.details?.moneda, monedaElegida, tasas))}
        {dato('Habitaciones', property.bedrooms)}
        {dato('Baños', property.bathrooms)}
        {dato('Área', `${property.size_sqft} m²`)}
        {dato('Terreno', property.terrain_type)}
        <p className='text-sm opacity-80 break-words'>{property.description}</p>
      </div>
      <div className='md:w-1/2 min-w-0'>
        <h3 className='font-semibold text-sm mb-2'>¿Te interesa esta propiedad?</h3>
        <InteresForm propertyId={property.id} />
      </div>
    </section>
  );
}

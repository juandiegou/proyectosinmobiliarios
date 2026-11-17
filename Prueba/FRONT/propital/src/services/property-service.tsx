import { Property } from "@/types";
import { convertir, type Tasas } from "@/services/currency";

/** Devuelve [lat, lon] aceptando {latitude, longitude} (formato del back) o [lat, lon]. */
export function getCoordinates(property: Property): [number, number] | null {
  const loc = property.location as unknown;
  if (Array.isArray(loc) && loc.length >= 2) {
    return [Number(loc[0]), Number(loc[1])];
  }
  if (loc && typeof loc === "object" && "latitude" in loc && "longitude" in loc) {
    const { latitude, longitude } = loc as { latitude: number; longitude: number };
    return [Number(latitude), Number(longitude)];
  }
  return null;
}



function formatear(monto: number, moneda: string) {
  try {
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: moneda, maximumFractionDigits: 0 }).format(monto);
  } catch {
    return `${monto} ${moneda}`;
  }
}

/** Muestra el precio en la moneda elegida; si no hay tasa, muestra el precio original. */
export function formatPrice(price: number, monedaOriginal: string | undefined, monedaElegida: string, tasas: Tasas | null) {
  if (!monedaOriginal) return String(price);
  if (!tasas || monedaElegida === monedaOriginal) return formatear(price, monedaOriginal);
  const convertido = convertir(price, monedaOriginal, monedaElegida, tasas);
  if (convertido === null) return formatear(price, monedaOriginal);
  return `${formatear(convertido, monedaElegida)} (${formatear(price, monedaOriginal)})`;
}

export function propertyToString(property:Property, monedaElegida: string, tasas: Tasas | null){
  return(
    <div>
        <strong>Dirección:</strong> {property.address} <br />
        <strong>Habitaciones:</strong> {property.bedrooms} <br />
        <strong>Baños:</strong> {property.bathrooms} <br />
        <strong>Precio:</strong> {formatPrice(property.price, property.details?.moneda, monedaElegida, tasas)} <br />
        <strong>Terreno:</strong> {property.terrain_type} <br />
        <strong>Tamaño:</strong> {property.size_sqft} mts2 <br /> 
        {
            property.discount>0.0?(<>
            <strong>Descuento:</strong>{property.discount} %<br />
            </>):(<></>)
        }
        {
            property.is_offer&&(<p><strong className="text-red-600">En oferta</strong><br /></p>)
        }

      </div>
  )
}

import { Property } from "@/types";



export function propertyToString(property:Property){
  return(
    <div>
        <strong>Dirección:</strong> {property.address} <br />
        <strong>Habitaciones:</strong> {property.bedrooms} <br />
        <strong>Baños:</strong> {property.bathrooms} <br />
        <strong>Precio:</strong> ${property.price} <br />
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

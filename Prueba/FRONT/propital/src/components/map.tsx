import { Property } from '@/types';
import { getCoordinates } from '@/services/property-service';
import { CurrencySelector } from '@/components/currency-selector';
import { PropertyPanel } from '@/components/property-panel';
import { useCurrencyStore } from '@/store/currency-store';
import { useState } from 'react';
import Map, { Marker } from 'react-map-gl';

interface PropertiesProps {
    data: { data: Property[] };
}

export function Properties({ data }: PropertiesProps) {
    const properties: Property[] = data.data ?? [];
    const [seleccionada, setSeleccionada] = useState<Property | null>(null);
    const monedaElegida = useCurrencyStore((st) => st.moneda);
    const tasas = useCurrencyStore((st) => st.tasas);

    return (
        <div className='container_map'>
            <div className='map'>
                <CurrencySelector />
                <Map
                    initialViewState={{
                        longitude: -75.50353,
                        latitude: 5.06989,
                        zoom: 3
                    }}
                    maxZoom={14}
                    minZoom={1}
                    style={{ width: '100%', height: '100%', position: 'absolute' }}
                    mapStyle='mapbox://styles/mapbox/streets-v11'
                    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                    testMode={true}
                >
                    {properties.map((property: Property) => {
                        const coords = getCoordinates(property);
                        if (!coords) return null;
                        const [lat, lon] = coords;
                        return (
                            <Marker
                                key={property.id}
                                longitude={lon}
                                latitude={lat}
                                anchor='center'
                                draggable={false}
                                color={seleccionada?.id === property.id ? 'blue' : 'black'}
                                onClick={() => setSeleccionada(property)}
                            />
                        );
                    })}
                </Map>
            </div>

            {seleccionada && (
                <PropertyPanel
                    property={seleccionada}
                    onClose={() => setSeleccionada(null)}
                    monedaElegida={monedaElegida}
                    tasas={tasas}
                />
            )}
        </div>
    );
}

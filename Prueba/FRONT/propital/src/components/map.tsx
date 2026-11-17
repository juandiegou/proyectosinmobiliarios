import { Property } from '@/types';
import { useToast } from '@/hooks';
import { propertyToString, getCoordinates } from '@/services/property-service';
import { CurrencySelector } from '@/components/currency-selector';
import { useCurrencyStore } from '@/store/currency-store';
import Map, { Marker, Popup } from 'react-map-gl';


interface PropertiesProps {
    data: { data: Property[] };
}


export function Properties({ data }: PropertiesProps) {
    const { addToast } = useToast();
    const properties: Property[] = data.data;
    const monedaElegida = useCurrencyStore((st) => st.moneda);
    const tasas = useCurrencyStore((st) => st.tasas);

    function openPopup(property: Property) {
        addToast(propertyToString(property, monedaElegida, tasas), "info");
    }
  
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
                    <>
                    
                        {properties?.map((property: Property, index: number) => {
                            const coords = getCoordinates(property);
                            if (!coords) return null;
                            const [lat, lon] = coords;
                            return (
                            <div key={index}
                                className='custom-marker mapboxgl-marker'
                                onClick={() => { openPopup(property); } }
                            >

                                <Marker
                                    key={index}
                                    longitude={lon}
                                    latitude={lat}
                                    anchor='center'
                                    draggable={false}
                                    color={'black'}
                                    onClick={() => { openPopup(property); } } />
                            </div>
                            );
                        })}
                    

                    </>

                </Map>
            </div>

        </div>

    );

};


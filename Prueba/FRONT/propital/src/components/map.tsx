import { useState } from 'react';
import { Property } from '@/types';
import { useToast } from '@/hooks';
import { propertyToString } from '@/services/property-service';
import Map, { Marker, Popup } from 'react-map-gl';

interface Props{
    properties: Property[]
}

const { addToast } = useToast();

export function Properties(data:any) {
  const properties:any[] = data.data;

  const openPopup = (property: Property) => {
        addToast(propertyToString(property),"info");
    };
  
    return (
        <div className='container_map'> 
            <div className='map'>
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
                    mapboxAccessToken='pk.eyJ1IjoianVhbmRpZWdvdWciLCJhIjoiY2xrZXEyMmh4MTFqYjNkcGpxNXhhMHAwcCJ9.ZCasxeuwdK9dZ1uYrppH-Q'
                    testMode={true}
                >
                    {/* <div className='custom-marker mapboxgl-marker'>

                    <Marker
                        longitude={-75.49331}
                        latitude={5.06885}
                        anchor='center' 
                        draggable={false}
                        color={'black'}
                    />
                    </div> */}
                    {properties?.data?.map((property: Property, index: number) => (
                        <div key={index} 
                            className='custom-marker mapboxgl-marker'
                            onClick={()=>{openPopup(property)}}
                        >

                            <Marker
                                key={index}
                                longitude={property.location[1]}
                                latitude={property.location[0]}
                                anchor='center'
                                draggable={false}
                                color={'black'}
                                onClick={()=>{openPopup(property)}}
                                />
                        </div>
                    ))}
                </Map>
            </div>

        </div>

    );

}


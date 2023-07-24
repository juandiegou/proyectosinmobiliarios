import { Button, Card, Input, Properties } from '@/components';
import { useToast } from '@/hooks';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';


const { addToast } = useToast();
export function Filter(){
    const [min_price, setMin_price]=useState()
    const [max_price, setMax_price]=useState()
    const [min_bedrooms, setMin_bedrooms]=useState()
    const [filter, setFilter] = useState('')
    const router = useRouter();

    useEffect(() => {
        // Filtrar los valores y construir el filtro actualizado
        const newFilter = Object.entries({
          min_price,
          max_price,
          min_bedrooms,
        })
          .filter(([_, v]) => v !== undefined && Number(v) > 0)
          .map(([k, v]) => `${k}=${v}`)
          .join("&");
      
        // Actualizar el filtro solo si ha cambiado
        if (filter !== newFilter) {

            setFilter(newFilter);
        }
      }, [min_price, max_price, min_bedrooms]);

    const handleFilter=(type:string,value: string)=>{
        const stateSetterMap:any = {
            min_price: setMin_price,
            max_price: setMax_price,
            min_bedrooms: setMin_bedrooms,
        };
      
          // Verificar si el tipo es válido y luego llamar a la función de setState correspondiente
          if (stateSetterMap[type]) {
            stateSetterMap[type](value);
          }
    }

    return(
        <Card className='bg-background rounded-none md:rounded-md mx-auto' >
            <h5 className='mb-4 self-start'>Filtros de Búsqueda</h5>
            <Input
                name='min_price'
                label='Precio Minimo'
                placeholder='Ingresa un valor'
                value={min_price?min_price:''}
                onChange={(e) => {handleFilter('min_price',e.target.value)}}
                type='number'
            />
            <Input
                name='max_price'
                label='Precio Máximo'
                placeholder='Ingresa un valor'
                value={max_price?max_price:''}
                onChange={(e) => {handleFilter('max_price',e.target.value)}}
                type='number'
            />
            <Input
                name='min_bedrooms'
                label='Minino de habitaciones'
                placeholder='Ingresa un valor'
                value={min_bedrooms?min_bedrooms:''}
                onChange={(e) => {handleFilter('min_bedrooms',e.target.value)}}
                type='number'
            />
            <Button
                className='mt-2'
                onClick={() => {
                    addToast('¡Filtrando!', 'success');
                    router.push(`?${filter}`);
                }}  
            >
                Filtrar
            </Button>

        </Card>
    )
}
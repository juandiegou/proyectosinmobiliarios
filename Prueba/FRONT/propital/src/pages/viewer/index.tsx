import { useState } from 'react';
import { Card, Properties, Filter } from '@/components';
import { requestAPI } from '@/request/axios-request';
import { Property } from '@/types';

export default function Viewer({ properties }: any) {
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const lista: Property[] = properties.data;
  const visibles = soloDisponibles ? lista.filter((p) => (p.estado ?? 'disponible') === 'disponible') : lista;
  return (
    <main className='min-h-full bg-background flex flex-col gap-4 p-2 md:p-4 md:flex-row md:items-start'>
      <Card className='w-full min-w-0 md:w-[80%] rounded-none md:rounded-md mx-auto'>
        <label className='flex items-center gap-2 p-2 text-sm'>
          <input type='checkbox' checked={soloDisponibles} onChange={(e) => setSoloDisponibles(e.target.checked)} />
          Mostrar solo disponibles
        </label>
        <Properties data={{ data: visibles }} />
      </Card>
      <Card className='w-full min-w-0 md:w-[20%] rounded-none md:rounded-md mx-auto'>
        <Filter />
      </Card>
    </main>
  );
}

export async function getServerSideProps(params: any) {
  const query = await params.query;
  const queryString = Object.keys(query)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
    .join('&');

  return await requestAPI.get('/filter/property?' + `${queryString}`).then((res) => {
    return {
      props: {
        properties: {
          data: res.data.data as Property[],
        },
      },
    };
  });
}

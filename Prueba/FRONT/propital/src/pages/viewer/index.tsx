import { Button, Card, Input, Properties, Filter } from '@/components';
import { requestAPI } from '@/request/axios-request';
import { Property } from '@/types';

interface Props{
  properties:Property[]
}

export default function viewer({properties}:any) {
  return (
    <main className='h-full bg-background md:flex md:items-center'>
      <Card className='h-fit w-full md:w-[80%] h-[70%] rounded-none md:rounded-md mx-auto container'>
        <Properties data={properties} />
      </Card>
      <Card className='h-fit w-full md:w-[15%] h-[70%] rounded-none md:rounded-md mx-auto container'>
        <Filter />

      </Card>
    </main>
  );
};

export async function getServerSideProps(params:any) {
  const query = await params.query
  const queryString = Object.keys(query)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
    .join('&');

  console.log(queryString); // Esta línea es opcional, solo para verificar la cadena de consulta generada

  return await requestAPI.get('/filter/property?'+`${queryString}`).then((res) => {
    return {
      props: {
        properties: {
         data: res.data.data,
        }
      },
    };
  }); 
}
  
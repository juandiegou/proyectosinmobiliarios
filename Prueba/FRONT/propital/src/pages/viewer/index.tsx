import { Card, Properties, Filter } from '@/components';
import { requestAPI } from '@/request/axios-request';
import { Property } from '@/types';

export default function viewer({ properties }: any) {
  return (
    <main className='min-h-full bg-background flex flex-col gap-4 p-2 md:p-4 md:flex-row md:items-start'>
      <Card className='w-full min-w-0 md:w-[80%] rounded-none md:rounded-md mx-auto'>
        <Properties data={properties} />
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

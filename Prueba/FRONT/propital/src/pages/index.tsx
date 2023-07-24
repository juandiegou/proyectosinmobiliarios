import Viewer from './viewer';
import { requestAPI } from '@/request/axios-request';

export default function Home({...property}:any) {
    return <main className='h-full bg-background'>
      <Viewer properties={property} />
    </main>;
}


export async function getServerSideProps(params:any) {
    // const {url} = params;
    return await requestAPI.get('/getall/').then((res) => {
      return {
        props: {
          data: res.data.data,
        },
      };
    }); 
  }


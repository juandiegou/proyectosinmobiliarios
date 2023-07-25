import Viewer from './viewer';
import { requestAPI } from '@/request/axios-request';
import { useEffect } from 'react';
import { useRouter } from 'next/router';


export default function Home({...property}:any) {
  const router = useRouter();
  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      router.push('/viewer');
    }, 2000);

    return () => clearTimeout(redirectTimeout);
  }, []);
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


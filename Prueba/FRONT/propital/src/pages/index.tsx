import type { GetServerSideProps } from 'next';

// La portada no carga propiedades: redirige directamente al visor,
// que hace su propia consulta filtrada.
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/viewer',
      permanent: false,
    },
  };
};

export default function Home() {
  return null;
}

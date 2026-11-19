import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export function Loader() {
    return (
        <div className='bg-background h-screen flex flex-col items-center justify-center gap-3'>
            <AiOutlineLoading3Quarters
                className='animate-spin'
                size={30}
            />
            <span className='mx-auto text-2xl'>Cargando...</span>
        </div>
    );
}

/** Spinner pequeño para botones mientras una acción se completa. */
export function Spinner({ size = 16 }: { size?: number }) {
    return <AiOutlineLoading3Quarters className='animate-spin inline-block' size={size} aria-hidden />;
}

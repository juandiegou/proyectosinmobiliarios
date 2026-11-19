import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSesion } from '@/hooks/use-sesion';
import { cerrarSesion } from '@/services/sesion';

const ENLACE_POR_ROL: Record<string, { href: string; texto: string }> = {
    admin: { href: '/admin/gestion', texto: 'Administración' },
    inmobiliaria: { href: '/inmobiliaria', texto: 'Mi inmobiliaria' },
    asesor: { href: '/asesor', texto: 'Mis propiedades' },
    cliente: { href: '/cuenta', texto: 'Mi cuenta' },
};

export function Navbar() {
    const router = useRouter();
    const { rol, listo } = useSesion();
    const enlace = rol ? ENLACE_POR_ROL[rol] : undefined;

    function salir() {
        cerrarSesion();
        router.push('/');
    }

    return (
        <nav className='min-h-[4rem] flex flex-row flex-wrap items-center justify-between gap-2 p-4 bg-backgroundDark shadow-sm shadow-gray'>
            <Link href='/'>Inicio</Link>
            {listo && (
                <div className='flex flex-row items-center gap-4 text-sm'>
                    {enlace ? (
                        <>
                            <Link href={enlace.href}>{enlace.texto}</Link>
                            <button onClick={salir} className='opacity-80 hover:opacity-100'>Salir</button>
                        </>
                    ) : (
                        <Link href='/login'>Ingresar</Link>
                    )}
                </div>
            )}
        </nav>
    );
}

/** Bloque gris animado que reserva el espacio del contenido mientras llega. */
export function Skeleton({ className = '' }: { className?: string }) {
    return <div aria-hidden className={`animate-pulse rounded bg-white/10 ${className}`} />;
}

/** Esqueleto de una lista de filas (favoritos, separaciones, propiedades). */
export function SkeletonLista({ filas = 3 }: { filas?: number }) {
    return (
        <div role='status' aria-label='Cargando' className='flex flex-col gap-3'>
            {Array.from({ length: filas }).map((_, i) => (
                <div key={i} className='flex flex-col gap-2 border-t border-white/10 pt-3'>
                    <Skeleton className='h-4 w-2/3' />
                    <Skeleton className='h-3 w-1/3' />
                </div>
            ))}
        </div>
    );
}

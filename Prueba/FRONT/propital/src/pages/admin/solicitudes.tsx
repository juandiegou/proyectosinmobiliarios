import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ApiError, clearToken, getToken } from '@/services/api';
import { ESTADOS, EstadoSolicitud, Solicitud, cambiarEstado, listarSolicitudes } from '@/services/solicitudes';

export default function AdminSolicitudes() {
  const router = useRouter();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [filtro, setFiltro] = useState<'todas' | EstadoSolicitud>('todas');
  const [error, setError] = useState('');

  function salir() {
    clearToken();
    router.replace('/login');
  }

  async function cargar() {
    try {
      setSolicitudes(await listarSolicitudes());
      setError('');
    } catch (e) {
      if (e instanceof ApiError && (e.status === 401 || e.status === 403)) {
        salir();
        return;
      }
      setError('No se pudieron cargar las solicitudes.');
    }
  }

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function actualizar(id: string, estado: EstadoSolicitud) {
    try {
      await cambiarEstado(id, estado);
      setSolicitudes((prev) => prev.map((s) => (s.id === id ? { ...s, estado } : s)));
    } catch {
      setError('No se pudo actualizar el estado.');
    }
  }

  const visibles = filtro === 'todas' ? solicitudes : solicitudes.filter((s) => s.estado === filtro);

  return (
    <main className='p-4 md:p-8 w-full max-w-6xl mx-auto flex flex-col gap-4 text-white'>
      <header className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
        <h1 className='text-xl font-semibold'>Solicitudes de interés</h1>
        <div className='flex gap-2 flex-wrap'>
          <select className='bg-backgroundDark rounded-lg p-2 text-sm' value={filtro} onChange={(e) => setFiltro(e.target.value as typeof filtro)}>
            <option value='todas'>Todas</option>
            {ESTADOS.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
          </select>
          <button onClick={salir} className='rounded-lg bg-backgroundDark p-2 text-sm'>Salir</button>
        </div>
      </header>

      {error && <p className='text-red-500 text-sm'>{error}</p>}
      {visibles.length === 0 && !error && <p className='opacity-70 text-sm'>No hay solicitudes para mostrar.</p>}

      <ul className='flex flex-col gap-3'>
        {visibles.map((s) => (
          <li key={s.id} className='bg-backgroundDark rounded-xl p-4 flex flex-col gap-2 md:flex-row md:items-start md:justify-between min-w-0'>
            <div className='flex flex-col gap-1 min-w-0 text-sm'>
              <span className='font-semibold break-words'>{s.nombre}</span>
              <span className='break-all'>{s.contacto}</span>
              <span className='opacity-70'>Propiedad #{s.property_id} · {new Date(s.created_at).toLocaleString('es-CO')}</span>
              {s.mensaje && <p className='opacity-80 break-words'>{s.mensaje}</p>}
            </div>
            <select
              className='bg-background rounded-lg p-2 text-sm md:w-48'
              value={s.estado}
              onChange={(e) => actualizar(s.id, e.target.value as EstadoSolicitud)}
              aria-label='Estado'
            >
              {ESTADOS.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
            </select>
          </li>
        ))}
      </ul>
    </main>
  );
}

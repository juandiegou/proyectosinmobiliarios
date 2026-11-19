import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSesion } from '@/hooks/use-sesion';
import { useToast } from '@/hooks';
import { Spinner } from '@/components/loader';
import { SkeletonLista, Skeleton } from '@/components/skeleton';
import { ApiError, getToken } from '@/services/api';
import { actualizarPerfil, cerrarSesion, miPerfil, Usuario } from '@/services/sesion';
import { listarFavoritos, quitarFavorito } from '@/services/favoritos';
import { ESTADOS_SEPARACION, Separacion, cancelarSeparacion, formatMonto, listarSeparaciones, pagarSeparacion } from '@/services/separaciones';
import type { Property } from '@/types';

const campo = 'w-full rounded-lg bg-backgroundDark border border-backgroundDark text-white p-2.5';
const boton = 'rounded-lg p-2.5 text-sm font-medium disabled:opacity-60';

export default function Cuenta() {
  const router = useRouter();
  const { rol, listo } = useSesion();
  const { addToast } = useToast();
  const [perfil, setPerfil] = useState<Usuario | null>(null);
  const [favoritos, setFavoritos] = useState<Property[]>([]);
  const [separaciones, setSeparaciones] = useState<Separacion[]>([]);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const [ocupadoId, setOcupadoId] = useState<string | null>(null);

  useEffect(() => {
    if (!listo) return;
    if (!getToken() || rol !== 'cliente') {
      router.replace('/login');
      return;
    }
    cargarTodo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listo, rol]);

  async function cargarTodo() {
    try {
      const [p, f, s] = await Promise.all([miPerfil(), listarFavoritos(), listarSeparaciones()]);
      setPerfil(p);
      setNombre(p.nombre ?? '');
      setTelefono(p.telefono ?? '');
      setFavoritos(f.data);
      setSeparaciones(s);
      setError('');
      setCargando(false);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        cerrarSesion();
        router.replace('/login');
        return;
      }
      setError('No pudimos cargar tu cuenta.');
      setCargando(false);
    }
  }

  async function guardarPerfil(e: React.FormEvent) {
    e.preventDefault();
    try {
      const actualizado = await actualizarPerfil({
        nombre,
        telefono: telefono || undefined,
        password: password || undefined,
      });
      setPerfil(actualizado);
      setPassword('');
      addToast('Perfil actualizado.', 'info');
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'No pudimos guardar tu perfil.', 'info');
    }
  }

  async function accion(clave: string, fn: () => Promise<unknown>, mensajeOk: string) {
    setOcupadoId(clave);
    try {
      await fn();
      addToast(mensajeOk, 'info');
      await cargarTodo();
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'La acción no se pudo completar.', 'info');
    } finally {
      setOcupadoId(null);
    }
  }

  function salir() {
    cerrarSesion();
    router.replace('/login');
  }

  if (!listo || rol !== 'cliente') return null;

  return (
    <main className='p-4 md:p-8 w-full max-w-5xl mx-auto flex flex-col gap-6 text-white'>
      <header className='flex items-center justify-between gap-3'>
        <h1 className='text-xl font-semibold'>Mi cuenta</h1>
        <div className='flex gap-2'>
          <Link href='/' className={`${boton} bg-backgroundDark`}>Ver propiedades</Link>
          <button onClick={salir} className={`${boton} bg-backgroundDark`}>Salir</button>
        </div>
      </header>
      {error && <p className='text-red-500 text-sm'>{error}</p>}

      <section className='bg-backgroundDark rounded-xl p-4 flex flex-col gap-3'>
        <h2 className='font-semibold'>Mis datos</h2>
        {cargando ? <Skeleton className='h-32 w-full' /> : (
        <form onSubmit={guardarPerfil} className='grid gap-3 md:grid-cols-2'>
          <input className={campo} value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder='Nombre' minLength={2} required />
          <input className={campo} value={perfil?.email ?? ''} disabled />
          <input className={campo} value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder='Teléfono' />
          <input className={campo} type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Nueva contraseña (opcional)' minLength={8} autoComplete='new-password' />
          <button type='submit' className={`${boton} bg-blue-700 hover:bg-blue-800 md:col-span-2`}>Guardar cambios</button>
        </form>
        )}
      </section>

      <section className='bg-backgroundDark rounded-xl p-4 flex flex-col gap-3'>
        <h2 className='font-semibold'>Mis favoritos ({favoritos.length})</h2>
        {cargando && <SkeletonLista filas={2} />}
        {!cargando && favoritos.length === 0 && <p className='text-sm opacity-70'>Aún no tienes favoritos. Guárdalos desde el mapa.</p>}
        {favoritos.map((p) => (
          <div key={p.id} className='flex items-center justify-between gap-3 text-sm'>
            <span className='break-words'>{p.address}</span>
            <button onClick={() => accion(`fav-${p.id}`, () => quitarFavorito(p.id), 'Quitado de favoritos.')} disabled={ocupadoId !== null} className='opacity-70 hover:opacity-100 disabled:opacity-40'>{ocupadoId === `fav-${p.id}` ? <Spinner /> : 'Quitar'}</button>
          </div>
        ))}
      </section>

      <section className='bg-backgroundDark rounded-xl p-4 flex flex-col gap-3'>
        <h2 className='font-semibold'>Mis separaciones</h2>
        {cargando && <SkeletonLista filas={2} />}
        {!cargando && separaciones.length === 0 && <p className='text-sm opacity-70'>No tienes separaciones.</p>}
        {separaciones.map((s) => (
          <div key={s.id} className='flex flex-col gap-2 border-t border-white/10 pt-3 text-sm md:flex-row md:items-center md:justify-between'>
            <div className='flex flex-col'>
              <span>Propiedad #{s.property_id} · {ESTADOS_SEPARACION[s.estado]}</span>
              <span className='opacity-70'>Monto: {formatMonto(s.monto, s.moneda)}{s.devuelto > 0 ? ` · Devuelto: ${formatMonto(s.devuelto, s.moneda)}` : ''}</span>
              {s.estado === 'vigente' && s.vence_en && <span className='opacity-70'>Vence: {new Date(s.vence_en).toLocaleDateString('es-CO')}</span>}
            </div>
            <div className='flex gap-2'>
              {s.estado === 'pendiente_pago' && (
                <button onClick={() => accion(s.id, () => pagarSeparacion(s.id), 'Pago aprobado. Propiedad separada.')} disabled={ocupadoId !== null} className={`${boton} bg-blue-700 hover:bg-blue-800`}>{ocupadoId === s.id && <Spinner />} Pagar</button>
              )}
              {(s.estado === 'pendiente_pago' || s.estado === 'vigente') && (
                <button onClick={() => window.confirm('¿Seguro que quieres desistir? Se aplicará la política de devolución.') && accion(s.id, () => cancelarSeparacion(s.id), 'Separación cancelada.')} disabled={ocupadoId !== null} className={`${boton} bg-backgroundDark border border-white/30`}>{ocupadoId === s.id && <Spinner />} Desistir</button>
              )}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

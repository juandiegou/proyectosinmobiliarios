import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSesion } from '@/hooks/use-sesion';
import { useToast } from '@/hooks';
import { Spinner } from '@/components/loader';
import { SkeletonLista } from '@/components/skeleton';
import { ApiError } from '@/services/api';
import { activarInmobiliaria, activarUsuario, crearInmobiliaria, expirarSeparaciones, Inmobiliaria, listarInmobiliarias, listarUsuarios } from '@/services/admin';
import { cerrarSesion, Usuario } from '@/services/sesion';

const campo = 'w-full rounded-lg bg-backgroundDark border border-backgroundDark text-white p-2.5';
const boton = 'rounded-lg p-2.5 text-sm font-medium disabled:opacity-60';
const vacio = { nombre: '', email: '', password: '', nombre_responsable: '' };

export default function Gestion() {
  const router = useRouter();
  const { rol, listo } = useSesion();
  const { addToast } = useToast();
  const [inmobiliarias, setInmobiliarias] = useState<Inmobiliaria[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [form, setForm] = useState(vacio);
  const [cargando, setCargando] = useState(true);
  const [ocupado, setOcupado] = useState<string | null>(null);

  useEffect(() => {
    if (!listo) return;
    if (rol !== 'admin') {
      router.replace('/login');
      return;
    }
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listo, rol]);

  async function cargar() {
    try {
      const [i, u] = await Promise.all([listarInmobiliarias(), listarUsuarios()]);
      setInmobiliarias(i);
      setUsuarios(u);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        cerrarSesion();
        router.replace('/login');
      }
    } finally {
      setCargando(false);
    }
  }

  async function accion(clave: string, fn: () => Promise<unknown>, mensajeOk: string) {
    setOcupado(clave);
    try {
      await fn();
      addToast(mensajeOk, 'info');
      await cargar();
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'La acción no se pudo completar.', 'info');
    } finally {
      setOcupado(null);
    }
  }

  async function crear(e: React.FormEvent) {
    e.preventDefault();
    await accion('crear', () => crearInmobiliaria(form), 'Inmobiliaria creada.');
    setForm(vacio);
  }

  function salir() {
    cerrarSesion();
    router.replace('/login');
  }

  if (!listo || rol !== 'admin') return null;

  return (
    <main className='p-4 md:p-8 w-full max-w-6xl mx-auto flex flex-col gap-6 text-white'>
      <header className='flex items-center justify-between gap-3 flex-wrap'>
        <h1 className='text-xl font-semibold'>Administración</h1>
        <div className='flex gap-2 flex-wrap'>
          <Link href='/admin/solicitudes' className={`${boton} bg-backgroundDark`}>Solicitudes</Link>
          <button onClick={() => accion('vencer', expirarSeparaciones, 'Vencimientos procesados.')} disabled={ocupado !== null} className={`${boton} bg-backgroundDark`}>
            {ocupado === 'vencer' && <Spinner />} Procesar vencimientos
          </button>
          <button onClick={salir} className={`${boton} bg-backgroundDark`}>Salir</button>
        </div>
      </header>

      <section className='bg-backgroundDark rounded-xl p-4 flex flex-col gap-3'>
        <h2 className='font-semibold'>Crear inmobiliaria</h2>
        <form onSubmit={crear} className='grid gap-3 md:grid-cols-2'>
          <input className={campo} placeholder='Nombre de la inmobiliaria' value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required minLength={2} />
          <input className={campo} placeholder='Nombre del responsable' value={form.nombre_responsable} onChange={(e) => setForm({ ...form, nombre_responsable: e.target.value })} required minLength={2} />
          <input className={campo} type='email' placeholder='Correo del responsable' value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className={campo} type='password' placeholder='Contraseña inicial (mínimo 8)' value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} autoComplete='new-password' />
          <button type='submit' disabled={ocupado !== null} className={`${boton} bg-blue-700 hover:bg-blue-800 md:col-span-2`}>
            {ocupado === 'crear' && <Spinner />} Crear inmobiliaria
          </button>
        </form>
      </section>

      <section className='bg-backgroundDark rounded-xl p-4 flex flex-col gap-3'>
        <h2 className='font-semibold'>Inmobiliarias ({inmobiliarias.length})</h2>
        {cargando && <SkeletonLista filas={2} />}
        {!cargando && inmobiliarias.map((i) => (
          <div key={i.id} className='flex items-center justify-between gap-3 border-t border-white/10 pt-3 text-sm'>
            <span>{i.nombre} · {i.activa ? 'Activa' : 'Desactivada'}</span>
            <button onClick={() => accion(`inmo-${i.id}`, () => activarInmobiliaria(i.id, !i.activa), i.activa ? 'Inmobiliaria desactivada.' : 'Inmobiliaria activada.')} disabled={ocupado !== null} className={`${boton} border border-white/30`}>
              {ocupado === `inmo-${i.id}` && <Spinner />} {i.activa ? 'Desactivar' : 'Activar'}
            </button>
          </div>
        ))}
      </section>

      <section className='bg-backgroundDark rounded-xl p-4 flex flex-col gap-3'>
        <h2 className='font-semibold'>Usuarios ({usuarios.length})</h2>
        {cargando && <SkeletonLista filas={3} />}
        {!cargando && usuarios.map((u) => (
          <div key={u.id} className='flex flex-col gap-2 border-t border-white/10 pt-3 text-sm md:flex-row md:items-center md:justify-between'>
            <span>{u.nombre} · {u.email} · {u.rol} · {u.activo ? 'Activo' : 'Desactivado'}</span>
            {u.rol !== 'admin' && (
              <button onClick={() => accion(`user-${u.id}`, () => activarUsuario(u.id, !u.activo), u.activo ? 'Usuario desactivado.' : 'Usuario activado.')} disabled={ocupado !== null} className={`${boton} border border-white/30`}>
                {ocupado === `user-${u.id}` && <Spinner />} {u.activo ? 'Desactivar' : 'Activar'}
              </button>
            )}
          </div>
        ))}
      </section>
    </main>
  );
}

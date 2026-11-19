import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSesion } from '@/hooks/use-sesion';
import { useToast } from '@/hooks';
import { Spinner } from '@/components/loader';
import { SkeletonLista } from '@/components/skeleton';
import { ApiError } from '@/services/api';
import { crearAsesor, editarAsesor, listarAsesores } from '@/services/gestion';
import { cerrarSesion, Usuario } from '@/services/sesion';
import { ESTADOS_SEPARACION, Separacion, formatMonto, listarSeparaciones } from '@/services/separaciones';
import { comisionesPorAsesor, FilaComision } from '@/services/reportes';

const campo = 'w-full rounded-lg bg-backgroundDark border border-backgroundDark text-white p-2.5';
const boton = 'rounded-lg p-2.5 text-sm font-medium disabled:opacity-60';
const vacio = { email: '', password: '', nombre: '', telefono: '', comision: '' };

export default function PanelInmobiliaria() {
  const router = useRouter();
  const { rol, listo } = useSesion();
  const { addToast } = useToast();
  const [asesores, setAsesores] = useState<Usuario[]>([]);
  const [separaciones, setSeparaciones] = useState<Separacion[]>([]);
  const [comisiones, setComisiones] = useState<Record<string, string>>({});
  const [form, setForm] = useState(vacio);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState<string | null>(null);
  const [reporte, setReporte] = useState<FilaComision[]>([]);
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  useEffect(() => {
    if (!listo) return;
    if (rol !== 'inmobiliaria') {
      router.replace('/login');
      return;
    }
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listo, rol]);

  async function cargar() {
    try {
      const [a, s, c] = await Promise.all([listarAsesores(), listarSeparaciones(), comisionesPorAsesor(desde || undefined, hasta || undefined)]);
      setAsesores(a);
      setSeparaciones(s);
      setReporte(c);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        cerrarSesion();
        router.replace('/login');
      }
    } finally {
      setCargando(false);
    }
  }

  async function crear(e: React.FormEvent) {
    e.preventDefault();
    setGuardando('crear');
    try {
      await crearAsesor({
        email: form.email,
        password: form.password,
        nombre: form.nombre,
        telefono: form.telefono || undefined,
        comision_pct: Number(form.comision),
      });
      setForm(vacio);
      addToast('Asesor creado.', 'info');
      cargar();
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'No pudimos crear el asesor.', 'info');
    } finally {
      setGuardando(null);
    }
  }

  async function guardarComision(id: string) {
    const valor = comisiones[id];
    if (valor === undefined || valor === '') return;
    setGuardando(id);
    try {
      await editarAsesor(id, { comision_pct: Number(valor) });
      addToast('Comisión actualizada.', 'info');
      cargar();
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'No pudimos actualizar la comisión.', 'info');
    } finally {
      setGuardando(null);
    }
  }

  async function alternarActivo(asesor: Usuario) {
    try {
      await editarAsesor(asesor.id, { activo: !asesor.activo });
      cargar();
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'No pudimos cambiar el estado del asesor.', 'info');
    }
  }

  function salir() {
    cerrarSesion();
    router.replace('/login');
  }

  if (!listo || rol !== 'inmobiliaria') return null;

  return (
    <main className='p-4 md:p-8 w-full max-w-6xl mx-auto flex flex-col gap-6 text-white'>
      <header className='flex items-center justify-between gap-3'>
        <h1 className='text-xl font-semibold'>Mi inmobiliaria</h1>
        <button onClick={salir} className={`${boton} bg-backgroundDark`}>Salir</button>
      </header>

      <section className='bg-backgroundDark rounded-xl p-4 flex flex-col gap-3'>
        <h2 className='font-semibold'>Crear asesor</h2>
        <form onSubmit={crear} className='grid gap-3 md:grid-cols-3'>
          <input className={campo} placeholder='Nombre' value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required minLength={2} />
          <input className={campo} type='email' placeholder='Correo' value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className={campo} placeholder='Teléfono (opcional)' value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
          <input className={campo} type='password' placeholder='Contraseña inicial (mínimo 8)' value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} autoComplete='new-password' />
          <input className={campo} type='number' step='any' placeholder='Comisión %' value={form.comision} onChange={(e) => setForm({ ...form, comision: e.target.value })} required min={0} max={100} />
          <button type='submit' disabled={guardando === 'crear'} className={`${boton} bg-blue-700 hover:bg-blue-800`}>{guardando === 'crear' && <Spinner />} Crear asesor</button>
        </form>
      </section>

      <section className='bg-backgroundDark rounded-xl p-4 flex flex-col gap-3'>
        <h2 className='font-semibold'>Asesores ({asesores.length})</h2>
        {cargando && <SkeletonLista filas={3} />}
        {!cargando && asesores.length === 0 && <p className='text-sm opacity-70'>Aún no tienes asesores.</p>}
        {asesores.map((a) => (
          <div key={a.id} className='flex flex-col gap-2 border-t border-white/10 pt-3 text-sm md:flex-row md:items-center md:justify-between'>
            <div className='flex flex-col'>
              <span>{a.nombre} · {a.email}</span>
              <span className='opacity-70'>Comisión actual: {a.comision_pct ?? 0}% · {a.activo ? 'Activo' : 'Desactivado'}</span>
            </div>
            <div className='flex flex-wrap gap-2 items-center'>
              <input
                className='rounded-lg bg-backgroundDark border border-white/20 p-2 w-28 text-white'
                type='number'
                step='any'
                min={0}
                max={100}
                placeholder='Nueva %'
                value={comisiones[a.id] ?? ''}
                onChange={(e) => setComisiones({ ...comisiones, [a.id]: e.target.value })}
              />
              <button onClick={() => guardarComision(a.id)} disabled={guardando !== null} className={`${boton} bg-blue-700 hover:bg-blue-800`}>{guardando === a.id && <Spinner />} Cambiar comisión</button>
              <button onClick={() => alternarActivo(a)} className={`${boton} border border-white/30`}>{a.activo ? 'Desactivar' : 'Activar'}</button>
            </div>
          </div>
        ))}
      </section>

      <section className='bg-backgroundDark rounded-xl p-4 flex flex-col gap-3'>
        <h2 className='font-semibold'>Comisiones por asesor</h2>
        <div className='flex flex-wrap items-end gap-2 text-sm'>
          <label className='flex flex-col gap-1'>Desde<input type='date' className={campo} value={desde} onChange={(e) => setDesde(e.target.value)} /></label>
          <label className='flex flex-col gap-1'>Hasta<input type='date' className={campo} value={hasta} onChange={(e) => setHasta(e.target.value)} /></label>
          <button onClick={cargar} className={`${boton} bg-blue-700 hover:bg-blue-800`}>Aplicar</button>
        </div>
        {reporte.length === 0 && <p className='text-sm opacity-70'>Sin comisiones en el período.</p>}
        {reporte.map((f) => (
          <div key={f.asesor_id} className='flex justify-between gap-3 border-t border-white/10 pt-3 text-sm'>
            <span>{f.asesor ?? 'Sin asesor'} · {f.separaciones} separación(es)</span>
            <span>Comisión: {f.comision_total.toLocaleString('es-CO')}</span>
          </div>
        ))}
      </section>

      <section className='bg-backgroundDark rounded-xl p-4 flex flex-col gap-3'>
        <h2 className='font-semibold'>Separaciones de la inmobiliaria</h2>
        {cargando && <SkeletonLista filas={2} />}
        {!cargando && separaciones.length === 0 && <p className='text-sm opacity-70'>Todavía no hay separaciones.</p>}
        {separaciones.map((s) => (
          <div key={s.id} className='flex flex-col text-sm border-t border-white/10 pt-3'>
            <span>Propiedad #{s.property_id} · {ESTADOS_SEPARACION[s.estado]}</span>
            <span className='opacity-70'>Monto: {formatMonto(s.monto, s.moneda)} · Comisión del asesor: {formatMonto(s.comision_asesor, s.moneda)}</span>
          </div>
        ))}
      </section>
    </main>
  );
}

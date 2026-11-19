import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSesion } from '@/hooks/use-sesion';
import { useToast } from '@/hooks';
import { Spinner } from '@/components/loader';
import { SkeletonLista } from '@/components/skeleton';
import { ApiError } from '@/services/api';
import { editarPropiedad, misPropiedades, publicarPropiedad } from '@/services/gestion';
import { ESTADOS_SEPARACION, Separacion, listarSeparaciones, venderSeparacion } from '@/services/separaciones';
import { cerrarSesion } from '@/services/sesion';
import type { Property } from '@/types';

const campo = 'w-full rounded-lg bg-backgroundDark border border-backgroundDark text-white p-2.5';
const boton = 'rounded-lg p-2.5 text-sm font-medium disabled:opacity-60';
const vacio = { address: '', price: '', bedrooms: '', bathrooms: '', size_sqft: '', terrain_type: '', description: '', lat: '', lng: '', monto: '', dias: '30', devolucion: '0' };

export default function PanelAsesor() {
  const router = useRouter();
  const { rol, listo } = useSesion();
  const { addToast } = useToast();
  const [propiedades, setPropiedades] = useState<Property[]>([]);
  const [separaciones, setSeparaciones] = useState<Separacion[]>([]);
  const [form, setForm] = useState(vacio);
  const [editando, setEditando] = useState<number | null>(null);
  const [edicion, setEdicion] = useState({ price: '', monto: '', dias: '', devolucion: '' });
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [vendiendo, setVendiendo] = useState<string | null>(null);

  useEffect(() => {
    if (!listo) return;
    if (rol !== 'asesor') {
      router.replace('/login');
      return;
    }
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listo, rol]);

  async function cargar() {
    try {
      const [p, s] = await Promise.all([misPropiedades(), listarSeparaciones()]);
      setPropiedades(p);
      setSeparaciones(s);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        cerrarSesion();
        router.replace('/login');
      }
    } finally {
      setCargando(false);
    }
  }

  const set = (campoNombre: keyof typeof vacio) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [campoNombre]: e.target.value });

  async function publicar(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    try {
      await publicarPropiedad({
        address: form.address,
        price: Number(form.price),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        size_sqft: Number(form.size_sqft),
        location: [Number(form.lat), Number(form.lng)],
        terrain_type: form.terrain_type,
        is_offer: false,
        discount: 0,
        description: form.description,
        separacion: { monto: Number(form.monto), dias_vencimiento: Number(form.dias), devolucion_pct: Number(form.devolucion) },
      });
      setForm(vacio);
      addToast('Propiedad publicada.', 'info');
      cargar();
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'No pudimos publicar la propiedad.', 'info');
    } finally {
      setGuardando(false);
    }
  }

  async function guardarEdicion(id: number) {
    setGuardando(true);
    try {
      const cambios: Parameters<typeof editarPropiedad>[1] = {};
      if (edicion.price) cambios.price = Number(edicion.price);
      if (edicion.monto || edicion.dias || edicion.devolucion) {
        const actual = propiedades.find((p) => p.id === id)?.separacion;
        cambios.separacion = {
          monto: Number(edicion.monto || actual?.monto || 0),
          dias_vencimiento: Number(edicion.dias || actual?.dias_vencimiento || 30),
          devolucion_pct: Number(edicion.devolucion || actual?.devolucion_pct || 0),
        };
      }
      await editarPropiedad(id, cambios);
      setEditando(null);
      addToast('Propiedad actualizada.', 'info');
      cargar();
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'No pudimos actualizar la propiedad.', 'info');
    } finally {
      setGuardando(false);
    }
  }

  async function vender(id: string) {
    setVendiendo(id);
    try {
      await venderSeparacion(id);
      addToast('Venta registrada.', 'info');
      cargar();
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'No pudimos registrar la venta.', 'info');
    } finally {
      setVendiendo(null);
    }
  }

  function salir() {
    cerrarSesion();
    router.replace('/login');
  }

  if (!listo || rol !== 'asesor') return null;

  return (
    <main className='p-4 md:p-8 w-full max-w-6xl mx-auto flex flex-col gap-6 text-white'>
      <header className='flex items-center justify-between gap-3'>
        <h1 className='text-xl font-semibold'>Mis propiedades</h1>
        <button onClick={salir} className={`${boton} bg-backgroundDark`}>Salir</button>
      </header>

      <section className='bg-backgroundDark rounded-xl p-4 flex flex-col gap-3'>
        <h2 className='font-semibold'>Publicar propiedad</h2>
        <form onSubmit={publicar} className='grid gap-3 md:grid-cols-3'>
          <input className={campo} placeholder='Dirección' value={form.address} onChange={set('address')} required />
          <input className={campo} type='number' placeholder='Precio' value={form.price} onChange={set('price')} required min={1} />
          <input className={campo} placeholder='Tipo de terreno' value={form.terrain_type} onChange={set('terrain_type')} required />
          <input className={campo} type='number' placeholder='Habitaciones' value={form.bedrooms} onChange={set('bedrooms')} required min={0} />
          <input className={campo} type='number' placeholder='Baños' value={form.bathrooms} onChange={set('bathrooms')} required min={0} />
          <input className={campo} type='number' placeholder='Área (m²)' value={form.size_sqft} onChange={set('size_sqft')} required min={0} />
          <input className={campo} type='number' step='any' placeholder='Latitud' value={form.lat} onChange={set('lat')} required />
          <input className={campo} type='number' step='any' placeholder='Longitud' value={form.lng} onChange={set('lng')} required />
          <textarea className={campo} placeholder='Descripción' value={form.description} onChange={set('description')} />
          <input className={campo} type='number' placeholder='Monto de separación' value={form.monto} onChange={set('monto')} required min={1} />
          <input className={campo} type='number' placeholder='Días de vigencia' value={form.dias} onChange={set('dias')} required min={1} max={180} />
          <input className={campo} type='number' placeholder='% de devolución' value={form.devolucion} onChange={set('devolucion')} required min={0} max={100} />
          <button type='submit' disabled={guardando} className={`${boton} bg-blue-700 hover:bg-blue-800 md:col-span-3`}>{guardando && <Spinner />} Publicar</button>
        </form>
      </section>

      <section className='bg-backgroundDark rounded-xl p-4 flex flex-col gap-3'>
        <h2 className='font-semibold'>Mis propiedades ({propiedades.length})</h2>
        {cargando && <SkeletonLista filas={3} />}
        {!cargando && propiedades.map((p) => (
          <div key={p.id} className='flex flex-col gap-2 border-t border-white/10 pt-3 text-sm'>
            <div className='flex flex-col gap-1 md:flex-row md:items-center md:justify-between'>
              <span>#{p.id} · {p.address} · {(p.estado ?? 'disponible')}</span>
              {(p.estado ?? 'disponible') === 'disponible' && (
                <button onClick={() => { setEditando(editando === p.id ? null : p.id); setEdicion({ price: '', monto: '', dias: '', devolucion: '' }); }} className='underline opacity-80 text-left'>
                  {editando === p.id ? 'Cancelar edición' : 'Editar'}
                </button>
              )}
            </div>
            {editando === p.id && (
              <div className='grid gap-2 md:grid-cols-4'>
                <input className={campo} type='number' placeholder={`Precio (${p.price})`} value={edicion.price} onChange={(e) => setEdicion({ ...edicion, price: e.target.value })} />
                <input className={campo} type='number' placeholder={`Separación (${p.separacion?.monto ?? '-'})`} value={edicion.monto} onChange={(e) => setEdicion({ ...edicion, monto: e.target.value })} />
                <input className={campo} type='number' placeholder={`Días (${p.separacion?.dias_vencimiento ?? '-'})`} value={edicion.dias} onChange={(e) => setEdicion({ ...edicion, dias: e.target.value })} />
                <input className={campo} type='number' placeholder={`% devolución (${p.separacion?.devolucion_pct ?? '-'})`} value={edicion.devolucion} onChange={(e) => setEdicion({ ...edicion, devolucion: e.target.value })} />
                <button onClick={() => guardarEdicion(p.id)} disabled={guardando} className={`${boton} bg-blue-700 hover:bg-blue-800 md:col-span-4`}>{guardando && <Spinner />} Guardar cambios</button>
              </div>
            )}
          </div>
        ))}
      </section>

      <section className='bg-backgroundDark rounded-xl p-4 flex flex-col gap-3'>
        <h2 className='font-semibold'>Separaciones de mis propiedades</h2>
        {cargando && <SkeletonLista filas={2} />}
        {!cargando && separaciones.length === 0 && <p className='text-sm opacity-70'>Todavía no hay separaciones.</p>}
        {separaciones.map((s) => (
          <div key={s.id} className='flex flex-col gap-2 border-t border-white/10 pt-3 text-sm md:flex-row md:items-center md:justify-between'>
            <div className='flex flex-col'>
              <span>Propiedad #{s.property_id} · {ESTADOS_SEPARACION[s.estado]}</span>
              <span className='opacity-70'>Monto: {s.monto.toLocaleString('es-CO')} · Tu comisión: {s.comision_asesor.toLocaleString('es-CO')} ({s.comision_pct}%)</span>
            </div>
            {s.estado === 'vigente' && (
              <button onClick={() => vender(s.id)} disabled={vendiendo !== null} className={`${boton} bg-blue-700 hover:bg-blue-800`}>{vendiendo === s.id && <Spinner />} Marcar como vendida</button>
            )}
          </div>
        ))}
      </section>
      <Link href='/' className='text-sm underline opacity-80'>Ver propiedades públicas</Link>
    </main>
  );
}

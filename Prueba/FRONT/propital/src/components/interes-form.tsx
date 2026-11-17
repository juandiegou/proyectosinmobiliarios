import { useState } from 'react';
import { crearSolicitud } from '@/services/solicitudes';
import { useToast } from '@/hooks';

interface Props {
  propertyId: number;
}

export function InteresForm({ propertyId }: Props) {
  const { addToast } = useToast();
  const [nombre, setNombre] = useState('');
  const [contacto, setContacto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    try {
      await crearSolicitud({ property_id: propertyId, nombre, contacto, mensaje: mensaje || undefined });
      addToast('Recibimos tu interés. Te contactaremos pronto.', 'info');
      setNombre('');
      setContacto('');
      setMensaje('');
    } catch {
      addToast('No pudimos enviar tu solicitud. Intenta de nuevo.', 'info');
    } finally {
      setEnviando(false);
    }
  }

  const campo = 'w-full rounded-lg bg-backgroundDark border border-backgroundDark text-white text-sm p-2';

  return (
    <form onSubmit={enviar} className='flex flex-col gap-2 w-full'>
      <input className={campo} placeholder='Nombre' value={nombre} onChange={(e) => setNombre(e.target.value)} required minLength={2} />
      <input className={campo} placeholder='Correo o teléfono' value={contacto} onChange={(e) => setContacto(e.target.value)} required minLength={5} />
      <textarea className={campo} placeholder='Mensaje (opcional)' value={mensaje} onChange={(e) => setMensaje(e.target.value)} rows={3} />
      <button type='submit' disabled={enviando} className='rounded-lg bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white text-sm font-medium p-2'>
        {enviando ? 'Enviando...' : 'Me interesa'}
      </button>
    </form>
  );
}

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { iniciarSesion, registrarCliente } from '@/services/sesion';
import { ApiError } from '@/services/api';

export default function Registro() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function crear(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError('');
    try {
      await registrarCliente({ nombre, email, password, telefono: telefono || undefined });
      await iniciarSesion(email, password);
      router.push('/cuenta');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No pudimos crear tu cuenta.');
    } finally {
      setCargando(false);
    }
  }

  const campo = 'w-full rounded-lg bg-backgroundDark border border-backgroundDark text-white p-2.5';

  return (
    <main className='min-h-[70vh] flex items-center justify-center p-4'>
      <form onSubmit={crear} className='w-full max-w-sm bg-backgroundDark text-white rounded-xl p-6 flex flex-col gap-4'>
        <h1 className='text-xl font-semibold'>Crear cuenta</h1>
        <input className={campo} placeholder='Nombre completo' value={nombre} onChange={(e) => setNombre(e.target.value)} required minLength={2} />
        <input className={campo} type='email' placeholder='Correo' value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete='email' />
        <input className={campo} placeholder='Teléfono (opcional)' value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        <input className={campo} type='password' placeholder='Contraseña (mínimo 8 caracteres)' value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete='new-password' />
        {error && <p className='text-red-500 text-sm'>{error}</p>}
        <button type='submit' disabled={cargando} className='rounded-lg bg-blue-700 hover:bg-blue-800 disabled:opacity-60 p-2.5 font-medium'>
          {cargando ? 'Creando...' : 'Crear cuenta'}
        </button>
        <Link href='/login' className='text-sm text-center underline opacity-80'>Ya tengo cuenta</Link>
      </form>
    </main>
  );
}

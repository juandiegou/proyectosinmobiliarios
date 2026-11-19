import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { iniciarSesion } from '@/services/sesion';
import { RUTA_POR_ROL } from '@/services/rutas';
import { ApiError } from '@/services/api';

export default function Login() {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError('');
    try {
      const rol = await iniciarSesion(usuario, password);
      router.push(RUTA_POR_ROL[rol] ?? '/');
    } catch (err) {
      setError(err instanceof ApiError && err.status === 403 ? err.message : 'Correo o contraseña incorrectos.');
    } finally {
      setCargando(false);
    }
  }

  const campo = 'w-full rounded-lg bg-backgroundDark border border-backgroundDark text-white p-2.5';

  return (
    <main className='min-h-[70vh] flex items-center justify-center p-4'>
      <form onSubmit={entrar} className='w-full max-w-sm bg-backgroundDark text-white rounded-xl p-6 flex flex-col gap-4'>
        <h1 className='text-xl font-semibold'>Iniciar sesión</h1>
        <input className={campo} placeholder='Correo' value={usuario} onChange={(e) => setUsuario(e.target.value)} required autoComplete='username' />
        <input className={campo} type='password' placeholder='Contraseña' value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete='current-password' />
        {error && <p className='text-red-500 text-sm'>{error}</p>}
        <button type='submit' disabled={cargando} className='rounded-lg bg-blue-700 hover:bg-blue-800 disabled:opacity-60 p-2.5 font-medium'>
          {cargando ? 'Entrando...' : 'Entrar'}
        </button>
        <Link href='/registro' className='text-sm text-center underline opacity-80'>Crear cuenta de cliente</Link>
      </form>
    </main>
  );
}

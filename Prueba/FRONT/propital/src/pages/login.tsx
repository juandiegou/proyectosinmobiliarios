import { useState } from 'react';
import { useRouter } from 'next/router';
import { loginAdmin } from '@/services/auth';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError('');
    try {
      await loginAdmin(username, password);
      router.push('/admin/solicitudes');
    } catch {
      setError('Usuario o contraseña incorrectos.');
    } finally {
      setCargando(false);
    }
  }

  const campo = 'w-full rounded-lg bg-backgroundDark border border-backgroundDark text-white p-2.5';

  return (
    <main className='min-h-[70vh] flex items-center justify-center p-4'>
      <form onSubmit={entrar} className='w-full max-w-sm bg-backgroundDark text-white rounded-xl p-6 flex flex-col gap-4'>
        <h1 className='text-xl font-semibold'>Acceso administrador</h1>
        <input className={campo} placeholder='Usuario' value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete='username' />
        <input className={campo} type='password' placeholder='Contraseña' value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete='current-password' />
        {error && <p className='text-red-500 text-sm'>{error}</p>}
        <button type='submit' disabled={cargando} className='rounded-lg bg-blue-700 hover:bg-blue-800 disabled:opacity-60 p-2.5 font-medium'>
          {cargando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </main>
  );
}

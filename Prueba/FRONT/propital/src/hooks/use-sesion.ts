import { useEffect, useState } from 'react';
import { getRol } from '@/services/api';

/** Rol de la sesión actual. Se lee en el navegador para no romper el render en el servidor. */
export function useSesion() {
  const [rol, setRol] = useState<string | null>(null);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    setRol(getRol());
    setListo(true);
  }, []);

  return { rol, listo };
}

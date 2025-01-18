import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const useIsAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    const userType = user ? JSON.parse(user).tipoUsuario : null;

    // console.log("Tipo de usuario: ", userType);

    if (userType === 'administrador') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
      router.push('/login'); // Redirige a la página de login si no es administrador
    }
  }, [router]);

  return isAdmin;
};

export default useIsAdmin;
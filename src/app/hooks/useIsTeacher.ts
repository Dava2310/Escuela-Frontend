import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const useIsTeacher = () => {
  const [isTeacher, setIsTeacher] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    const userType = user ? JSON.parse(user).tipoUsuario : null;

    // console.log("Tipo de usuario: ", userType);

    if (userType === 'profesor') {
      setIsTeacher(true);
    } else {
      setIsTeacher(false);
      router.push('/login'); // Redirige a la página de login si no es administrador
    }
  }, [router]);

  return isTeacher;
};

export default useIsTeacher;
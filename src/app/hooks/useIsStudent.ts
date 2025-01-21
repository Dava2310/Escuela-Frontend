import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const useIsStudent = () => {
  const [isStudent, setIsStudent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    const userType = user ? JSON.parse(user).tipoUsuario : null;

    // console.log("Tipo de usuario: ", userType);

    if (userType === 'estudiante') {
      setIsStudent(true);
    } else {
      setIsStudent(false);
      router.push('/login'); // Redirige a la página de login si no es administrador
    }
  }, [router]);

  return isStudent;
};

export default useIsStudent;
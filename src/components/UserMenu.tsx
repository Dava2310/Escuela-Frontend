import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { CircleUser } from "lucide-react"; // Ajusta la ruta si es necesario

import axios from "axios";
import ip from "../app/constants/constants.js";
import { useRouter } from "next/navigation"

export default function UserMenu() {

  const router = useRouter();
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('accessToken'); // Obtén el token del almacenamiento local

      if (!token) {
          console.error('No token found');
          return;
      }

      // Configura los encabezados de la solicitud con el token de autenticación
      const config = {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      };

      // Llamar a la API para cerrar sesión
      await axios.get(`${ip}/api/auth/logout`, config);

      // Eliminar el token del almacenamiento local o de cookies
      localStorage.removeItem('accessToken'); // Si estás usando localStorage
      // Si estás usando cookies, puedes utilizar js-cookie o una librería similar
      // import Cookies from 'js-cookie';
      // Cookies.remove('token');

      // Redirigir al usuario a la página de inicio de sesión
      router.push('/login');
  } catch (error) {
      console.error('Error al cerrar sesión', error);
  }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <CircleUser className="h-5 w-5" />
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Cerrar Sesión</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

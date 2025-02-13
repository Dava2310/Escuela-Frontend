"use client"

import useAuthCheck from '@/app/hooks/useAuthCheck'; // Importa el hook
import useIsStudent from '@/app/hooks/useIsStudent';;

import UserMenu from "@/components/UserMenu";
import { AppSidebar } from '@/components/app-sidebar-student';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"

import { useEffect } from 'react';
import ip from "../../constants/constants.js";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation"; // Cambiar la importación aquí
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { z } from "zod";

const formSchema = z.object({
    nombre: z
        .string()
        .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
        .max(50, { message: "El nombre no puede tener más de 50 caracteres." })
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: "El nombre solo puede contener letras y espacios." }),

    apellido: z
        .string()
        .min(2, { message: "El apellido debe tener al menos 2 caracteres." })
        .max(50, { message: "El apellido no puede tener más de 50 caracteres." })
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: "El apellido solo puede contener letras y espacios." }),

    email: z
        .string()
        .email({ message: "El correo electrónico no es válido." }),

    cedula: z
        .string()
        .min(6, { message: "La cédula debe tener al menos 6 caracteres." })
        .max(20, { message: "La cédula no puede tener más de 20 caracteres." })
        .regex(/^[0-9]+$/, { message: "La cédula solo puede contener números." }),

    preguntaSeguridad: z
        .string()
        .min(10, { message: "La pregunta de seguridad debe tener al menos 10 caracteres." })
        .max(255, { message: "La pregunta de seguridad no puede tener más de 255 caracteres." }),

    respuestaSeguridad: z
        .string()
        .min(2, { message: "La respuesta de seguridad debe tener al menos 2 caracteres." })
        .max(255, { message: "La respuesta de seguridad no puede tener más de 255 caracteres." }),

    fechaNacimiento: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "La fecha de nacimiento debe tener el formato YYYY-MM-DD." })
        .refine((fecha) => {
            const fechaNacimiento = new Date(fecha);
            const hoy = new Date();
            let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
            const mes = hoy.getMonth() - fechaNacimiento.getMonth();
            if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
                edad--;
            }
            return edad >= 5 && edad <= 120;
        }, { message: "La edad debe estar entre 5 y 120 años." }),

    direccion: z
        .string()
        .min(5, { message: "La dirección debe tener al menos 5 caracteres." })
        .max(255, { message: "La dirección no puede tener más de 255 caracteres." }),

    numeroTelefono: z
        .string()
        .regex(
            /^\+\d{1,3}(424|412|414|416|426)\d{7}$/,
            { message: "El número de teléfono debe comenzar con un código de país (+XX) seguido de 424, 412, 414, 416 o 426, y luego 7 dígitos." }
        ),
});

function quitarHora(fechaISO: string): string {
    return fechaISO.split("T")[0];
}

export default function Page() {

    const router = useRouter();

    // Verifica si el usuario está autenticado
    useAuthCheck();

    // Verifica si el usuario es de tipo estudiante
    useIsStudent();

    // Definicion del formulario
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nombre: '',
            apellido: '',
            email: '',
            cedula: '',
            preguntaSeguridad: '',
            respuestaSeguridad: '',
            numeroTelefono: '',
            direccion: '',
            fechaNacimiento: ''
        }
    })

    // Funcion para enviar los datos al controlador del Backend
    function onSubmit(values: z.infer<typeof formSchema>) {
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

            toast.promise(
                axios.patch(`${ip}/api/users/current`, values, config),
                {
                    loading: 'Cargando...',
                    success: (response) => {
                        return `${response.data.body.message}`;
                    },
                    error: (error) => {
                        console.log(error)
                        return `${error.response?.data?.body?.message}`;
                    }
                }
            )
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            console.error('No token found');
            router.push('/login');
            return; // Asegúrate de terminar la ejecución si no hay token
        }

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        axios.get(`${ip}/api/users/current`, config)
            .then((response) => {
                const { nombre, apellido, email, cedula, numeroTelefono, direccion, preguntaSeguridad, respuestaSeguridad } = response.data.body.data;

                const fechaNacimiento = quitarHora(response.data.body.data.fechaNacimiento);

                form.setValue('nombre', nombre || '');
                form.setValue('apellido', apellido || '');
                form.setValue('email', email || '');
                form.setValue('cedula', cedula || '');
                form.setValue('preguntaSeguridad', preguntaSeguridad ?? '');
                form.setValue('respuestaSeguridad', respuestaSeguridad ?? '');
                form.setValue('numeroTelefono', numeroTelefono || '');
                form.setValue('direccion', direccion || '');
                form.setValue('fechaNacimiento', fechaNacimiento || '');
            })
            .catch((error) => {
                console.error(error);
            });
    }, [form, router]);


    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">
                                    Perfil
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Cambiar Datos</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="w-full flex-1">

                    </div>
                    <UserMenu />
                </header>

                <div className="text-4xl font-bold text-center text-blue-500 p-6">
                    <h1>Cambiar Datos Personales</h1>
                </div>

                {/* Formulario */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 md:p-8">

                        {/* Nombre */}
                        <div className="grid gap-2">
                            <FormField
                                control={form.control}
                                name="nombre"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Apellido */}
                        <div className="grid gap-2">
                            <FormField
                                control={form.control}
                                name="apellido"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Apellido</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Email */}
                        <div className="grid gap-2">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Cédula */}
                        <div className="grid gap-2">
                            <FormField
                                control={form.control}
                                name="cedula"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cédula</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Direccion */}
                        <div className="grid gap-2">
                            <FormField
                                control={form.control}
                                name="direccion"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Direccion</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Fecha Nacimiento */}
                        <div className="grid gap-2">
                            <FormField
                                control={form.control}
                                name="fechaNacimiento"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fecha de Nacimiento</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Fecha Nacimiento */}
                        <div className="grid gap-2">
                            <FormField
                                control={form.control}
                                name="numeroTelefono"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Número de Teléfono</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Pregunta Seguridad */}
                        <div className="grid gap-2">
                            <FormField
                                control={form.control}
                                name="preguntaSeguridad"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Pregunta de Seguridad</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Respuesta Seguridad */}
                        <div className="grid gap-2">
                            <FormField
                                control={form.control}
                                name="respuestaSeguridad"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Respuesta de Seguridad</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Botón de Enviar */}
                        <Button type="submit" className="w-full mt-4">
                            Guardar Cambios
                        </Button>
                    </form>
                </Form>
                <Toaster richColors closeButton expand />
            </SidebarInset>
        </SidebarProvider>
    )
}
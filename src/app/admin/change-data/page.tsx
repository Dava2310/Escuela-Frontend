/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import useAuthCheck from "../../hooks/useAuthCheck"; // Importa el hook
import useIsAdmin from '../../hooks/useIsAdmin';

import { Eye, EyeOff } from "lucide-react"

import UserMenu from "@/components/UserMenu";
import { AppSidebar } from "@/components/app-sidebar-admin"
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
    nombre: z.string(),
    apellido: z.string(),
    email: z.string().email(),
    cedula: z.string(),
    preguntaSeguridad: z.string(),
    respuestaSeguridad: z.string()
})

export default function Page() {

    const router = useRouter();

    // Verifica si el usuario está autenticado
    useAuthCheck();

    // Verifica si el usuario es de tipo administrador
    useIsAdmin();

    // Definicion del formulario
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nombre: '',
            apellido: '',
            email: '',
            cedula: '',
            preguntaSeguridad: '',
            respuestaSeguridad: ''
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
                const { nombre, apellido, email, cedula, preguntaSeguridad, respuestaSeguridad } = response.data.body.data;

                form.setValue('nombre', nombre || '');
                form.setValue('apellido', apellido || '');
                form.setValue('email', email || '');
                form.setValue('cedula', cedula || '');
                form.setValue('preguntaSeguridad', preguntaSeguridad ?? '');
                form.setValue('respuestaSeguridad', respuestaSeguridad ?? '');
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
                                    Inicio
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            {/* <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                            </BreadcrumbItem> */}
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
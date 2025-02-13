"use client"

import useAuthCheck from '@/app/hooks/useAuthCheck';
import useIsStudent from '@/app/hooks/useIsStudent';
import { Eye, EyeOff } from "lucide-react"
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

import { useState } from 'react';
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
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { z } from "zod";

const formSchema = z.object({
    currentPassword: z.string(),
    newPassword: z.string(),
    confirmPassword: z.string()
})

export default function Page() {

    // Verifica si el usuario está autenticado
    useAuthCheck();

    // Verifica si el usuario es de tipo administrador
    useIsStudent();

    // Definicion del formulario
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
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
                axios.patch(`${ip}/api/auth/changePassword`, values, config),
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

    const [showPassword, setShowPassword] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
    }); // Estado para controlar la visibilidad de las contraseñas

    // Función para alternar la visibilidad de las contraseñas
    const togglePasswordVisibility = (field: 'currentPassword' | 'newPassword' | 'confirmPassword') => {
        setShowPassword((prevState) => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };


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
                                <BreadcrumbPage>Cambiar Contraseña</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="w-full flex-1">

                    </div>
                    <UserMenu />
                </header>

                <div className="text-4xl font-bold text-center text-blue-500 p-6">
                    <h1>Cambiar Contraseña</h1>
                </div>

                {/* Formulario */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 md:p-8">

                        {/* Contraseña Actual */}
                        <div className="grid gap-2">
                            <FormField
                                control={form.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contraseña Actual</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword.currentPassword ? 'text' : 'password'} // Alterna entre texto y contraseña
                                                    {...field}
                                                    id="currentPassword"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => togglePasswordVisibility('currentPassword')}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                                >
                                                    {showPassword.currentPassword ? (
                                                        <EyeOff className="h-5 w-5" />
                                                    ) : (
                                                        <Eye className="h-5 w-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Nueva Contraseña */}
                        <div className="grid gap-2">
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nueva Contraseña</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword.newPassword ? 'text' : 'password'} // Alterna entre texto y contraseña
                                                    {...field}
                                                    id="newPassword"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => togglePasswordVisibility('newPassword')}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                                >
                                                    {showPassword.newPassword ? (
                                                        <EyeOff className="h-5 w-5" />
                                                    ) : (
                                                        <Eye className="h-5 w-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Confirmar Contraseña */}
                        <div className="grid gap-2">
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirmar Contraseña</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword.confirmPassword ? 'text' : 'password'} // Alterna entre texto y contraseña
                                                    {...field}
                                                    id="confirmPassword"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => togglePasswordVisibility('confirmPassword')}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                                >
                                                    {showPassword.confirmPassword ? (
                                                        <EyeOff className="h-5 w-5" />
                                                    ) : (
                                                        <Eye className="h-5 w-5" />
                                                    )}
                                                </button>
                                            </div>
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
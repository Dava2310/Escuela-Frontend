"use client"

import useAuthCheck from "@/app/hooks/useAuthCheck";
import useIsAdmin from "@/app/hooks/useIsAdmin";

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

import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import axios from "axios";
import ip from "@/app/constants/constants";

const formSchema = z.object({
    titulo: z.string().min(2, {
        message: "El título debe tener al menos 2 caracteres.",
    }),
    descripcion: z.string().min(10, {
        message: "La descripción debe tener al menos 10 caracteres.",
    }),
    fechaExpedicion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "La fecha debe estar en formato YYYY-MM-DD.",
    }),
})

export default function Page() {

    // Verifica si el usuario está autenticado
    useAuthCheck();

    // Verifica si el usuario es de tipo administrador
    useIsAdmin();

    let creado = false;
    const router = useRouter()
    const params = useParams();
    const estudianteId = params.estudianteId
    const seccionId = params.seccionId

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            titulo: "",
            descripcion: "",
            fechaExpedicion: new Date().toISOString().split("T")[0],
        },
    })

    useEffect(() => {
        if (!estudianteId || !seccionId) {
            router.push("/admin/certificates")
        }
    }, [estudianteId, seccionId, router])

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
                axios.post(`${ip}/api/certificates/student/${estudianteId}/seccion/${seccionId}`, values, config),
                {
                    loading: 'Cargando...',
                    duration: 3000,
                    success: (response) => {
                        creado = true;
                        return `${response.data.body.message}`;
                    },
                    error: (error) => {
                        console.log(error)
                        return `${error.response?.data?.body?.message}`;
                    },
                    onAutoClose: () => {
                        // Después de crear el certificado, redirigir a la página de gestión de certificados

                        if (creado) {
                            router.push("/admin/certificates")
                        }
                        
                    }
                }
            )
        } catch (error) {
            console.error(error);
        }

    }

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
                                    Certificados
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Crear</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="w-full flex-1">

                    </div>
                    <UserMenu />
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <h1 className="text-3xl font-bold mb-6">Crear Certificado</h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="titulo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Título del Certificado</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ingrese el título del certificado" {...field} />
                                        </FormControl>
                                        <FormDescription>Este es el título que aparecerá en el certificado.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="descripcion"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Descripción</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Ingrese la descripción del certificado" className="resize-none" {...field} />
                                        </FormControl>
                                        <FormDescription>Proporcione una breve descripción del certificado.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="fechaExpedicion"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fecha de Expedición</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormDescription>Seleccione la fecha de expedición del certificado.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Crear Certificado</Button>
                        </form>
                    </Form>
                </div>
                <Toaster richColors closeButton expand />
            </SidebarInset>
        </SidebarProvider>
    )
}
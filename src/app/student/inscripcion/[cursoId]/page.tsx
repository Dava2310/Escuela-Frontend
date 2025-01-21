/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import useAuthCheck from "@/app/hooks/useAuthCheck"; // Importa el hook
import useIsStudent from "@/app/hooks/useIsStudent";

import UserMenu from "@/components/UserMenu";
import { AppSidebar } from "@/components/app-sidebar-student"
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

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import ip from "@/app/constants/constants";

import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import axios from "axios";

const formSchema = z.object({
    referenciaPago: z
        .string()
        .min(1, "La referencia de pago es requerida")
        .startsWith("#", "La referencia debe comenzar con #"),
    fechaExpedicion: z.string().min(1, "La fecha de pago es requerida"),
    banco: z.string().min(1, "El banco es requerido"),
    monto: z
        .string()
        .min(1, "El monto es requerido")
        .refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0, {
            message: "El monto debe ser un número positivo",
        }),
    seccionId: z.string(),
})

export default function Page() {

    // Verifica si el usuario está autenticado
    useAuthCheck();

    // Verifica si el usuario es de tipo estudiante
    useIsStudent();

    const router = useRouter();
    const params = useParams();

    const cursoId = params.cursoId

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            referenciaPago: "",
            fechaExpedicion: "",
            banco: "",
            monto: "",
            seccionId: ""
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            // Obteniendo el token de acceso
            const accessToken = localStorage.getItem("accessToken");
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            };

            const newValues = {
                ...values,
                cursoId: cursoId
            }

            toast.promise(axios.post(`${ip}/api/inscripciones/`, newValues, config), {
                loading: 'Cargando...',
                duration: Infinity,
                success: (response) => {
                    router.push("/student/courses");
                    return `${response.data.body.message}`;
                },
                error: (error) => {
                    console.log(error);
                    return `${error.response?.data?.body?.message}`;
                }
            })
        } catch (error) {
            console.error(error);
        }
    }

    const [secciones, setSecciones] = useState([])

    useEffect(() => {
        const fetchSecciones = async () => {
            try {

                const accessToken = localStorage.getItem("accessToken");
                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }

                const response = await axios.get(`${ip}/api/secciones/${cursoId}`, config);
                setSecciones(response.data.body.data)

            } catch (error) {
                console.error(error);
            }
        }

        fetchSecciones();
    }, [cursoId])

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
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Dashboard</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="w-full flex-1">

                    </div>
                    <UserMenu />
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <Card className="max-w-lg mx-auto">
                        <CardHeader>
                            <CardTitle>Formulario de Inscripción</CardTitle>
                            <CardDescription>Curso ID: {params.cursoId}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                                    <FormField
                                        control={form.control}
                                        name="seccionId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecciona una sección" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {/* Datos de los Analistas */}
                                                        {secciones.map((seccion: any) => (
                                                            <SelectItem key={seccion.id.toString()} value={seccion.id.toString()}>
                                                                 {seccion.codigo} (Capacidad: {seccion.capacidad}, Salón: {seccion.salon})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="referenciaPago"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Referencia de Pago</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="#123456" {...field} />
                                                </FormControl>
                                                <FormDescription>Ingrese la referencia de pago comenzando con #</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="fechaExpedicion"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Fecha de Expedición del Pago</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="banco"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Banco</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecciona un banco" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Banco Mercantil">Banco Mercantil</SelectItem>
                                                        <SelectItem value="Banco de Venezuela">Banco de Venezuela</SelectItem>
                                                        <SelectItem value="Banesco">Banesco</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="monto"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Monto</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="0.00" step="0.01" {...field} />
                                                </FormControl>
                                                <FormDescription>Ingrese el monto del pago</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full">
                                        Enviar Inscripción
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </SidebarInset>
            <Toaster richColors closeButton expand />
        </SidebarProvider>
    )
}

"use client"

import useAuthCheck from "../../../../hooks/useAuthCheck"; // Importa el hook
import useIsAdmin from '../../../../hooks/useIsAdmin';
import ip from '@/app/constants/constants';
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

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import axios from "axios"
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

const formSchema = z.object({
    codigo: z.string().min(1, "El código es requerido"),
    capacidad: z.number().min(1, "La capacidad debe ser al menos 1"),
    salon: z.string().min(1, "El salón es requerido"),
    profesorId: z.string().min(1, "Debe seleccionar un profesor"),
})

interface Profesor {
    id: string
    nombre: string
    apellido: string
}

export default function CrearSeccionPage() {

    // Verifica si el usuario está autenticado
    useAuthCheck();

    // Verifica si el usuario es de tipo administrador
    useIsAdmin();

    const router = useRouter()
    const [profesores, setProfesores] = useState<Profesor[]>([])
    
    // Parametro para el cursoId
    const params = useParams();
    const cursoId = params.cursoId

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            codigo: "",
            capacidad: 0,
            salon: "",
            profesorId: "",
        },
    })

    useEffect(() => {

        const fetchTeachers = async () => {
            try {

                // Consiguiendo el token de acceso
                const accessToken = localStorage.getItem("accessToken");
                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                };
                const response = await axios.get(`${ip}/api/teachers`, config);
                setProfesores(response.data.body.data as Profesor[]);

            } catch (error) {
                console.error(error)
            }
        }

        const fetchCourse = async () => {
            try {
                
                const accessToken = localStorage.getItem("accessToken");
                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                };

                const response = await axios.get(`${ip}/api/courses/${cursoId}`, config);
                form.setValue("codigo", response.data.body.data.codigo + "-");

            } catch (error) {
                console.error(error);
            }
        }

        fetchCourse();
        fetchTeachers();
    }, [cursoId, form])

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // Obteniendo el token de acceso
            const accessToken = localStorage.getItem("accessToken");
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            };

            const newValues = {
                codigo: values.codigo,
                capacidad: values.capacidad,
                salon: values.salon,
                profesorId: values.profesorId,
                cursoId: cursoId
            }

            toast.promise(axios.post(`${ip}/api/secciones/`, newValues, config), {
                loading: 'Cargando...',
                duration: Infinity,
                success: (response) => {
                    router.push("/admin/courses");
                    return `${response.data.body.message}`;
                },
                error: (error) => {
                    console.log(error);
                    return `${error.response?.data?.body?.message}`;
                }
            })


        } catch (error) {
            console.error(error)
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
                                    Cursos
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Registrar</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="w-full flex-1">

                    </div>
                    <UserMenu />
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <h1 className="text-3xl font-bold mb-6">Crear Nueva Sección</h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="codigo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Código</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: SEC001" {...field} />
                                        </FormControl>
                                        <FormDescription>Ingrese el código único para esta sección.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="capacidad"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Capacidad</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} onChange={(e) => field.onChange(Number.parseInt(e.target.value))} />
                                        </FormControl>
                                        <FormDescription>Ingrese la capacidad máxima de estudiantes para esta sección.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="salon"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Salón</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: Aula 101" {...field} />
                                        </FormControl>
                                        <FormDescription>Ingrese el salón asignado para esta sección.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="profesorId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Profesor</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione un profesor" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {profesores.map((profesor) => (
                                                    <SelectItem key={profesor.id.toString()} value={profesor.id.toString()}>
                                                        {profesor.nombre + " " + profesor.apellido}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>Seleccione el profesor para esta sección.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit">Crear Sección</Button>
                        </form>
                    </Form>
                </div>
                <Toaster richColors closeButton expand />
            </SidebarInset>
        </SidebarProvider>
    )
}

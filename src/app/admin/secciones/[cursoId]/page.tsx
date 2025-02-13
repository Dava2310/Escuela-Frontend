/* eslint-disable @typescript-eslint/no-explicit-any */
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

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import axios from "axios";
import ip from "@/app/constants/constants";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
// Definición del esquema de validación para el formulario de sección
const seccionSchema = z.object({
    id: z.number(),
    codigo: z.string().min(1, "El código es requerido"),
    capacidad: z.number().min(1, "La capacidad debe ser al menos 1"),
    salon: z.string().min(1, "El salón es requerido"),
    profesorId: z.string().min(1, "Debe seleccionar un profesor"),
})

// Tipos
type Seccion = z.infer<typeof seccionSchema>
type Profesor = { id: string; nombre: string }

// Funcionalidad para los estudiantes
import { DataTable } from "./data-table";
import { useEstudiantes, EstudiantesProvider } from "./StudentsContext"
import { columns } from "./columns"

const ListSecciones = () => {

    // Verifica si el usuario está autenticado
    useAuthCheck();

    // Verifica si el usuario es de tipo administrador
    useIsAdmin();

    // CursoID
    const params = useParams();
    const cursoId = params.cursoId

    // Carga de las secciones
    const [secciones, setSecciones] = useState<Seccion[]>([])
    const [profesores, setProfesores] = useState<Profesor[]>([])

    useEffect(() => {

        const fetchSecciones = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken");
                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                };

                const response = await axios.get(`${ip}/api/secciones/${cursoId}`, config);
                setSecciones(response.data.body.data as Seccion[])

            } catch (error: any) {
                console.error("Error fetching data:", error);
            }
        }

        const fetchTeachers = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken");
                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                };

                const response = await axios.get(`${ip}/api/teachers/`, config)
                setProfesores(response.data.body.data as Profesor[]);

            } catch (error) {
                console.error(error);
            }
        }

        fetchTeachers();
        fetchSecciones();
        
    }, [cursoId])


    const [seccionSeleccionada, setSeccionSeleccionada] = useState<Seccion | null>(null)

    const { estudiantes, fetchEstudiantes } = useEstudiantes();

    const form = useForm<Seccion>({
        resolver: zodResolver(seccionSchema),
        defaultValues: {
            id: 0,
            codigo: "",
            capacidad: 0,
            salon: "",
            profesorId: "",
        },
    })

    const onSubmit = async (values: Seccion) => {
        if (seccionSeleccionada) {
            const valores = {
                codigo: values.codigo,
                capacidad: values.capacidad,
                salon: values.salon,
                profesorId: values.profesorId
            }

            try {
                
                const accessToken = localStorage.getItem("accessToken");
                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                };

                const response = await axios.patch(`${ip}/api/secciones/${values.id}`, valores, config);
                toast.success(response.data.body.message)

                // Actualizar sección existente
                setSecciones(secciones.map((s) => (s.id === values.id ? values : s)))
                setSeccionSeleccionada(values)

            } catch (error) {
                console.error(error);
            }
        }
    }

    const seleccionarSeccion = (seccion: Seccion | null) => {
        // console.log("Sección seleccionada:", seccion); // Verifica si la sección tiene los datos correctos
        setSeccionSeleccionada(seccion)
        if (seccion) {
            fetchEstudiantes(seccion.id)
            form.reset(seccion)
        } else {
            form.reset()
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
                    <h1 className="text-3xl font-bold mb-6">Secciones del Curso</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Seleccionar Sección</h2>
                            <Select onValueChange={(value) => {
                                const selectedId = Number(value); // Convierte el valor a number
                                const selectedSeccion = secciones.find((s) => s.id === selectedId); // Busca la sección

                                // console.log("Valor seleccionado:", value); // Verifica el valor
                                // console.log("Sección encontrada:", selectedSeccion); // Verifica la sección encontrada

                                seleccionarSeccion(selectedSeccion || null); // Llama a la función para actualizar la sección seleccionada
                            }}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Seleccione una sección" />
                                </SelectTrigger>
                                <SelectContent>
                                    {secciones.map((seccion) => (
                                        <SelectItem key={seccion.id.toString()} value={seccion.id.toString()}>
                                            {seccion.codigo} - {seccion.salon}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold mb-4">
                                {seccionSeleccionada
                                    ? `Editar Sección: ${seccionSeleccionada.codigo}`
                                    : "Seleccione una sección para editar"}
                            </h2>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="codigo"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Código</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
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
                                                    <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                                                </FormControl>
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
                                                    <Input {...field} />
                                                </FormControl>
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
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccione un profesor" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {profesores.map((profesor) => (
                                                            <SelectItem key={profesor.id.toString()} value={profesor.id.toString()}>
                                                                {profesor.nombre}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" disabled={!seccionSeleccionada}>
                                        Actualizar Sección
                                    </Button>


                                </form>
                            </Form>
                        </div>
                    </div>
                    <div className="mt-10">
                        <h1 className="text-4xl font-bold text-center text-blue-500">
                            Lista de Estudiantes
                        </h1>

                        <div className="container mx-auto mt-4">
                            <DataTable columns={columns} data={estudiantes} />
                        </div>
                    </div>
                </div>
                <Toaster richColors closeButton expand />
            </SidebarInset>
        </SidebarProvider>
    )
}

export default function Page() {
    return (
        <EstudiantesProvider>
            <ListSecciones />
        </EstudiantesProvider>
    )
}

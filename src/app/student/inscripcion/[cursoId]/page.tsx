/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import axios from "axios"
import { toast } from "sonner"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import useAuthCheck from "@/app/hooks/useAuthCheck"
import useIsStudent from "@/app/hooks/useIsStudent"
import UserMenu from "@/components/UserMenu"
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
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toaster } from "@/components/ui/sonner"

import ip from "@/app/constants/constants"

interface Horario {
    dias: any
    id: number
    fechaInicio: string
    fechaFinal: string
    horaInicio: string
    horaFinal: string
    tipo: string
}

interface Seccion {
    id: number
    codigo: string
    capacidad: number
    salon: string
    horario: Horario
    diasRepeticion: string[]
    nombreCurso: string
}

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
    useAuthCheck()
    useIsStudent()

    const router = useRouter()
    const params = useParams()
    const cursoId = params.cursoId

    const [secciones, setSecciones] = useState<Seccion[]>([])
    const [selectedSeccion, setSelectedSeccion] = useState<Seccion | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            referenciaPago: "",
            fechaExpedicion: "",
            banco: "",
            monto: "",
            seccionId: "",
        },
    })

    useEffect(() => {
        const fetchSecciones = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken")
                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
                const response = await axios.get(`${ip}/api/secciones/${cursoId}`, config)
                setSecciones(response.data.body.data)
            } catch (error) {
                console.error(error)
            }
        }

        fetchSecciones()
    }, [cursoId])

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        try {
            const accessToken = localStorage.getItem("accessToken")
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
            const newValues = {
                ...values,
                cursoId: cursoId,
            }
            toast.promise(axios.post(`${ip}/api/inscripciones/`, newValues, config), {
                loading: "Cargando...",
                success: (response) => {
                    router.push("/student/courses")
                    return `${response.data.body.message}`
                },
                error: (error) => {
                    console.log(error)
                    return `${error.response?.data?.body?.message}`
                },
            })
        } catch (error) {
            console.error(error)
        }
    }

    const handleSeccionChange = (seccionId: string) => {
        const seccion = secciones.find((s) => s.id.toString() === seccionId)
        setSelectedSeccion(seccion || null)
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
                                <BreadcrumbLink href="#">Inicio</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Dashboard</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="w-full flex-1"></div>
                    <UserMenu />
                </header>
                <div className="flex flex-1 gap-4 p-4">
                    <Card className="w-1/2">
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
                                                <FormLabel>Sección</FormLabel>
                                                <Select
                                                    onValueChange={(value) => {
                                                        field.onChange(value)
                                                        handleSeccionChange(value)
                                                    }}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecciona una sección" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {secciones.map((seccion) => (
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
                    <Card className="w-1/2">
                        <CardHeader>
                            <CardTitle>Detalles del Curso, Seccion y Horario</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Datos para Pago de Curso: </h3>
                                <p>Documento de Identidad: V-11.222.333</p>
                                <p>Número de Teléfono: 0412-123-4567</p>
                                <p>Banco: 0102 - Banco de Venezuela</p>
                            </div>
                            {selectedSeccion ? (
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold mb-2">Curso: {selectedSeccion.nombreCurso}</h3>
                                    <h3 className="text-lg font-semibold mb-2">Sección: {selectedSeccion.codigo}</h3>
                                    <p>Salón: {selectedSeccion.salon}</p>
                                    <p>Capacidad: {selectedSeccion.capacidad}</p>

                                    <div className="mt-4">
                                        <h4 className="text-md font-semibold mb-2">Horario:</h4>
                                        {selectedSeccion.horario ? (
                                            <div className="p-3 bg-gray-100 rounded-md">
                                                <p>Tipo: {selectedSeccion.horario.tipo}</p>
                                                <p>Fecha de inicio: {format(new Date(selectedSeccion.horario.fechaInicio), "PPP", { locale: es })}</p>
                                                <p>Fecha de fin: {format(new Date(selectedSeccion.horario.fechaFinal), "PPP", { locale: es })}</p>
                                                <p>Hora de inicio: {selectedSeccion.horario.horaInicio}</p>
                                                <p>Hora de fin: {selectedSeccion.horario.horaFinal}</p>
                                                <p>Días: {selectedSeccion.horario.dias?.length ? selectedSeccion.horario.dias.map((d: { dia: any }) => d.dia).join(", ") : "Sin días asignados"}</p>
                                            </div>
                                        ) : (
                                            <p className="text-gray-500">Esta sección no tiene horario asignado.</p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <p>Seleccione una sección para ver los detalles del curso y del horario.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </SidebarInset>
            <Toaster richColors closeButton expand />
        </SidebarProvider>
    )
}

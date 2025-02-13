/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Clock, Pencil } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

const diasSemana = [
    { id: "lunes", label: "Lunes" },
    { id: "martes", label: "Martes" },
    { id: "miercoles", label: "Miércoles" },
    { id: "jueves", label: "Jueves" },
    { id: "viernes", label: "Viernes" },
    { id: "sabado", label: "Sábado" },
    { id: "domingo", label: "Domingo" },
]

const formSchema = z.object({
    fechaInicio: z.date({
        required_error: "La fecha de inicio es requerida.",
    }),
    fechaFinal: z.date({
        required_error: "La fecha de finalización es requerida.",
    }),
    horaInicio: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: "Formato de hora inválido. Use HH:MM.",
    }),
    horaFinal: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: "Formato de hora inválido. Use HH:MM.",
    }),
    diasRepeticion: z.array(z.string()).min(1, "Seleccione al menos un día de repetición."),
    tipo: z.string()
})

interface Horario {
    id: number
    fechaInicio: string
    fechaFin: string
    horaInicio: string
    horaFinal: string
    diasRepeticion: string[]
    tipo: string
}

interface Seccion {
    id: number
    codigo: string
    capacidad: number
    salon: string
    profesorId: number
    cursoId: number
    horarioId: number | null
    horario: Horario | null
}

interface Curso {
    id: number
    nombre: string
    codigo: string
    secciones: Seccion[]
}

import ip from "../../app/constants/constants.js";
import axios from 'axios'

import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function HorarioViewer() {
    const [cursos, setCursos] = useState<Curso[]>([])
    const [selectedCurso, setSelectedCurso] = useState<string | null>(null)
    const [selectedSeccion, setSelectedSeccion] = useState<string | null>(null)
    const [isEditing, setIsEditing] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fechaInicio: new Date(),
            fechaFinal: new Date(),
            horaInicio: "",
            horaFinal: "",
            diasRepeticion: [],
            tipo: ""
        },
    })

    useEffect(() => {
        // Simular la carga de cursos desde una API
        const fetchCursos = async () => {

            try {

                const accessToken = localStorage.getItem("accessToken");
                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }

                const response = await axios.get(`${ip}/api/courses/schedules/`, config);
                setCursos(response.data.body.data)
            } catch (error) {
                console.error(error)
            }

            // En una implementación real, esto sería una llamada a la API
            // const mockCursos: Curso[] = [
            //     {
            //         id: 1,
            //         nombre: "Matemáticas Avanzadas",
            //         codigo: "MAT101",
            //         secciones: [
            //             {
            //                 id: 1,
            //                 codigo: "A",
            //                 capacidad: 30,
            //                 salon: "Aula 101",
            //                 profesorId: 1,
            //                 cursoId: 1,
            //                 horarioId: 1,
            //                 horario: {
            //                     id: 1,
            //                     fechaInicio: "2023-09-01",
            //                     fechaFin: "2023-12-15",
            //                     horaInicio: "08:00",
            //                     horaFin: "10:00",
            //                     diasRepeticion: ["lunes", "miercoles"],
            //                     tipo: "Presencial"
            //                 },
            //             },
            //             {
            //                 id: 2,
            //                 codigo: "B",
            //                 capacidad: 25,
            //                 salon: "Aula 102",
            //                 profesorId: 2,
            //                 cursoId: 1,
            //                 horarioId: 2,
            //                 horario: {
            //                     id: 2,
            //                     fechaInicio: "2023-09-01",
            //                     fechaFin: "2023-12-15",
            //                     horaInicio: "10:00",
            //                     horaFin: "12:00",
            //                     diasRepeticion: ["martes", "jueves"],
            //                     tipo: "Presencial"
            //                 },
            //             },
            //         ],
            //     },
            //     {
            //         id: 2,
            //         nombre: "Programación Orientada a Objetos",
            //         codigo: "POO202",
            //         secciones: [
            //             {
            //                 id: 3,
            //                 codigo: "A",
            //                 capacidad: 20,
            //                 salon: "Lab 201",
            //                 profesorId: 3,
            //                 cursoId: 2,
            //                 horarioId: 3,
            //                 horario: {
            //                     id: 3,
            //                     fechaInicio: "2023-09-01",
            //                     fechaFin: "2023-12-15",
            //                     horaInicio: "14:00",
            //                     horaFin: "16:00",
            //                     diasRepeticion: ["lunes", "miercoles", "viernes"],
            //                     tipo: "Presencial"
            //                 },
            //             },
            //         ],
            //     },
            // ]

            // setCursos(mockCursos)
        }

        fetchCursos()
    }, [])

    const seccionesDelCursoSeleccionado = selectedCurso
        ? cursos.find((curso) => curso.id.toString() === selectedCurso)?.secciones || []
        : []

    const horarioSeleccionado = selectedSeccion
        ? seccionesDelCursoSeleccionado.find((seccion) => seccion.id.toString() === selectedSeccion)?.horario
        : null

    useEffect(() => {
        if (horarioSeleccionado) {
            form.reset({
                fechaInicio: new Date(horarioSeleccionado.fechaInicio),
                fechaFinal: new Date(horarioSeleccionado.fechaFin),
                horaInicio: horarioSeleccionado.horaInicio,
                horaFinal: horarioSeleccionado.horaFinal,
                diasRepeticion: horarioSeleccionado.diasRepeticion,
            })
        }
    }, [horarioSeleccionado, form])

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // 1. Obtener el token de acceso
            const accessToken = localStorage.getItem("accessToken");
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            };

            // 2. Realizar la llamada PATCH al backend para actualizar el horario
            const response = await axios.patch(`${ip}/api/schedules/${selectedCurso}/secciones/${selectedSeccion}/horario`, {
                fechaInicio: values.fechaInicio.toISOString(),
                fechaFinal: values.fechaFinal.toISOString(),
                horaInicio: values.horaInicio,
                horaFinal: values.horaFinal,
                diasRepeticion: values.diasRepeticion, // Asegúrate de pasar los días como array
                tipo: values.tipo,
                cursoId: selectedCurso,
                seccionId: selectedSeccion
            }, config);

            // 3. Si la respuesta es exitosa, actualizar el estado local
            toast.success('Horario actualizado con éxito');
            setCursos((prevCursos) =>
                prevCursos.map((curso) => {
                    if (curso.id.toString() === selectedCurso) {
                        return {
                            ...curso,
                            secciones: curso.secciones.map((seccion) => {
                                if (seccion.id.toString() === selectedSeccion) {
                                    return {
                                        ...seccion,
                                        horario: {
                                            ...seccion.horario!,
                                            ...values, // Actualiza los valores del horario en el frontend
                                            fechaInicio: values.fechaInicio.toISOString(),
                                            fechaFinal: values.fechaFinal.toISOString(),
                                        },
                                    };
                                }
                                return seccion;
                            }),
                        };
                    }
                    return curso;
                })
            );

            // 4. Cerrar el editor de horarios después de la actualización
            setIsEditing(false);

        } catch (error) {
            console.error("Error al actualizar el horario:", error);
            toast.error("Error al actualizar el horario");
        }
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Selección de Curso y Sección</CardTitle>
                    <CardDescription>Elija el curso y la sección para ver o editar el horario.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="curso">Curso</Label>
                        <Select
                            value={selectedCurso || ""}
                            onValueChange={(value) => {
                                setSelectedCurso(value)
                                setSelectedSeccion(null)
                            }}
                        >
                            <SelectTrigger id="curso">
                                <SelectValue placeholder="Seleccione un curso" />
                            </SelectTrigger>
                            <SelectContent>
                                {cursos.map((curso) => (
                                    <SelectItem key={curso.id} value={curso.id.toString()}>
                                        {curso.nombre} ({curso.codigo})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="seccion">Sección</Label>
                        <Select
                            value={selectedSeccion || ""}
                            onValueChange={(value) => setSelectedSeccion(value)}
                            disabled={!selectedCurso}
                        >
                            <SelectTrigger id="seccion">
                                <SelectValue placeholder="Seleccione una sección" />
                            </SelectTrigger>
                            <SelectContent>
                                {seccionesDelCursoSeleccionado.map((seccion) => (
                                    <SelectItem key={seccion.id} value={seccion.id.toString()}>
                                        Sección {seccion.codigo}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {horarioSeleccionado && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            Detalles del Horario
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                                        <Pencil className="mr-2 h-4 w-4" /> Editar
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Editar Horario</DialogTitle>
                                        <DialogDescription>
                                            Realice los cambios necesarios en el horario. Haga clic en guardar cuando termine.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="fechaInicio"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-col">
                                                        <FormLabel>Fecha de Inicio</FormLabel>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <FormControl>
                                                                    <Button
                                                                        variant={"outline"}
                                                                        className={cn(
                                                                            "w-full pl-3 text-left font-normal",
                                                                            !field.value && "text-muted-foreground",
                                                                        )}
                                                                    >
                                                                        {field.value ? (
                                                                            format(field.value, "PPP", { locale: es })
                                                                        ) : (
                                                                            <span>Seleccione una fecha</span>
                                                                        )}
                                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0" align="start">
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={field.value}
                                                                    onSelect={field.onChange}
                                                                    disabled={(date) => date < new Date("1900-01-01")}
                                                                    initialFocus
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="fechaFinal"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-col">
                                                        <FormLabel>Fecha de Finalización</FormLabel>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <FormControl>
                                                                    <Button
                                                                        variant={"outline"}
                                                                        className={cn(
                                                                            "w-full pl-3 text-left font-normal",
                                                                            !field.value && "text-muted-foreground",
                                                                        )}
                                                                    >
                                                                        {field.value ? (
                                                                            format(field.value, "PPP", { locale: es })
                                                                        ) : (
                                                                            <span>Seleccione una fecha</span>
                                                                        )}
                                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0" align="start">
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={field.value}
                                                                    onSelect={field.onChange}
                                                                    disabled={(date) => date < new Date("1900-01-01")}
                                                                    initialFocus
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="horaInicio"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Hora de Inicio</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input placeholder="HH:MM" {...field} />
                                                                <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="horaFinal"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Hora de Finalización</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input placeholder="HH:MM" {...field} />
                                                                <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            {/* <FormField
                        control={form.control}
                        name="salon"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Salón</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: Aula 101" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      /> */}
                                            <FormField
                                                control={form.control}
                                                name="diasRepeticion"
                                                render={() => (
                                                    <FormItem>
                                                        <div className="mb-4">
                                                            <FormLabel className="text-base">Días de Repetición</FormLabel>
                                                            <FormDescription>Seleccione los días en que se repetirá el horario.</FormDescription>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                                            {diasSemana.map((dia) => (
                                                                <FormField
                                                                    key={dia.id}
                                                                    control={form.control}
                                                                    name="diasRepeticion"
                                                                    render={({ field }) => {
                                                                        return (
                                                                            <FormItem key={dia.id} className="flex flex-row items-start space-x-3 space-y-0">
                                                                                <FormControl>
                                                                                    <Checkbox
                                                                                        checked={field.value?.includes(dia.id)}
                                                                                        onCheckedChange={(checked) => {
                                                                                            return checked
                                                                                                ? field.onChange([...(field.value || []), dia.id])
                                                                                                : field.onChange(field.value?.filter((value) => value !== dia.id))
                                                                                        }}
                                                                                    />
                                                                                </FormControl>
                                                                                <FormLabel className="font-normal">{dia.label}</FormLabel>
                                                                            </FormItem>
                                                                        )
                                                                    }}
                                                                />
                                                            ))}
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            {/* <FormField
                                                control={form.control}
                                                name="capacidad"
                                                render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Capacidad</FormLabel>
                                                    <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="Ej: 30"
                                                        {...field}
                                                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                                    />
                                                    </FormControl>
                                                    <FormDescription>
                                                    Número máximo de participantes. Deje en blanco si no hay límite.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                                )}
                                            /> */}

                                            <FormField
                                                control={form.control}
                                                name="tipo"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Modalidad</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Seleccione una modalidad" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value='Presencial'>Presencial</SelectItem>
                                                                <SelectItem value='Virtual'>Virtual</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <Button type="submit">Guardar Cambios</Button>
                                        </form>
                                    </Form>
                                </DialogContent>
                            </Dialog>
                        </CardTitle>
                        <CardDescription>Información detallada del horario seleccionado.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <dt className="font-bold">Fecha de Inicio:</dt>
                                <dd>{format(new Date(horarioSeleccionado.fechaInicio), "PPP", { locale: es })}</dd>
                            </div>
                            <div>
                                <dt className="font-bold">Fecha de Finalización:</dt>
                                <dd>{format(new Date(horarioSeleccionado.fechaFin), "PPP", { locale: es })}</dd>
                            </div>
                            <div>
                                <dt className="font-bold">Hora de Inicio:</dt>
                                <dd>{horarioSeleccionado.horaInicio}</dd>
                            </div>
                            <div>
                                <dt className="font-bold">Hora de Finalización:</dt>
                                <dd>{horarioSeleccionado.horaFinal}</dd>
                            </div>
                            {/* <div>
                                <dt className="font-medium">Salón:</dt>
                                <dd>{horarioSeleccionado.salon}</dd>
                            </div> */}
                            <div>
                                <dt className="font-bold">Días de Repetición:</dt>
                                <dd>
                                    {horarioSeleccionado.diasRepeticion
                                        .map((dia) => diasSemana.find((d) => d.id === dia)?.label)
                                        .join(", ")}
                                </dd>
                            </div>
                            <div>
                                <dt className="font-bold">Tipo:</dt>
                                <dd>{horarioSeleccionado.tipo || "Presencial"}</dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>
            )}
            <Toaster richColors closeButton expand />
        </div>
    )
}


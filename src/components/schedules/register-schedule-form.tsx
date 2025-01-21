/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { toast } from "sonner";

const diasSemana = [
  { id: 'Lunes', label: 'Lunes' },
  { id: 'Martes', label: 'Martes' },
  { id: 'Miércoles', label: 'Miércoles' },
  { id: 'Jueves', label: 'Jueves' },
  { id: 'Viernes', label: 'Viernes' },
  { id: 'Sábado', label: 'Sábado' },
  { id: 'Domingo', label: 'Domingo' },
]

import ip from "../../app/constants/constants.js";
import axios from 'axios'

const formSchema = z.object({
  cursoId: z.string({
    required_error: 'Por favor seleccione un curso.',
  }),
  seccionId: z.string({
    required_error: "Por favor seleccione una sección.",
  }),
  fechaInicio: z.date({
    required_error: 'La fecha de inicio es requerida.',
  }),
  fechaFinal: z.date({
    required_error: 'La fecha de finalización es requerida.',
  }),
  horaInicio: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Formato de hora inválido. Use HH:MM.',
  }),
  horaFinal: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Formato de hora inválido. Use HH:MM.',
  }),
  diasRepeticion: z.array(z.string()).optional(),
  tipo: z.string(),
}).refine((data) => data.fechaInicio <= data.fechaFinal, {
  message: 'La fecha de inicio debe ser anterior o igual a la fecha de finalización.',
  path: ['fechaFin'],
}).refine((data) => {
  const inicio = new Date(`1970-01-01T${data.horaInicio}:00`)
  const fin = new Date(`1970-01-01T${data.horaFinal}:00`)
  return inicio < fin
}, {
  message: 'La hora de inicio debe ser anterior a la hora de finalización.',
  path: ['horaFin'],
})

interface Seccion {
  id: number
  codigo: string
  capacidad: number
  salon: string
  profesorId: number
  cursoId: number
  horarioId: number | null
  estudiantes: any[]
}

interface Curso {
  id: number
  nombre: string
  codigo: string
  descripcion: string
  categoria: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  secciones: Seccion[]
  estado: string
  matricula: number
}

export function CrearHorarioForm() {

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cursoId: '',
      seccionId: "",
      fechaInicio: new Date(),
      fechaFinal: new Date(),
      horaInicio: '',
      horaFinal: '',
      diasRepeticion: [],
      tipo: ''
    },
  })

  const [cursos, setCursos] = useState<Curso[]>([])

  useEffect(() => {
    const fetchCursos = async () => {
      try {

        const accessToken = localStorage.getItem("accessToken");
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }

        const response = await axios.get(`${ip}/api/courses/`, config);
        setCursos(response.data.body.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchCursos()
  }, [])

  const seccionesDelCursoSeleccionado =
    cursos.find((curso) => curso.id.toString() === form.watch("cursoId"))?.secciones || []

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Obteniendo el token de acceso
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      toast.promise(axios.post(`${ip}/api/schedules/`, values, config), {
        loading: 'Cargando...',
        duration: Infinity,
        success: (response) => {
          router.push('/admin/dashboard')
          return `${response.data.body.message}`;
        },
        error: (error) => {
          console.error(error)
          return `${error.response?.data?.body?.message}`;
        }
      })

    } catch (error) {
      console.error(error)
    }
  }



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Selección de Curso y Sección</CardTitle>
            <CardDescription>Elija el curso y la sección para la cual desea crear el horario.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="cursoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Curso</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      form.setValue("seccionId", "") // Reset sección when curso changes
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un curso" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {
                        cursos.map((curso) => (
                          <SelectItem key={curso.id.toString()} value={curso.id.toString()}>
                            {curso.nombre}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="seccionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sección</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una sección" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {seccionesDelCursoSeleccionado.length === 0 ? (
                        <SelectItem value="no-sections" disabled>
                          Seleccione un curso primero
                        </SelectItem>
                      ) : (
                        seccionesDelCursoSeleccionado.map((seccion) => (
                          <SelectItem key={seccion.id.toString()} value={seccion.id.toString()}>
                            {seccion.codigo} (Capacidad: {seccion.capacidad}, Salón: {seccion.salon})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fechas y Horas</CardTitle>
            <CardDescription>Establece el período y horario del curso.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
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
                              !field.value && "text-muted-foreground"
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
                          disabled={(date) =>
                            date < new Date() || date > new Date("2100-01-01")
                          }
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
                              !field.value && "text-muted-foreground"
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
                          disabled={(date) =>
                            date < new Date() || date > new Date("2100-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="horaInicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de Inicio</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="HH:MM"
                          {...field}
                        />
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
                        <Input
                          placeholder="HH:MM"
                          {...field}
                        />
                        <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ubicación y Detalles</CardTitle>
            <CardDescription>Especifica el salón y otros detalles del horario.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">

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

            <FormField
              control={form.control}
              name="diasRepeticion"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Días de Repetición</FormLabel>
                    <FormDescription>
                      Seleccione los días en que se repetirá el horario.
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {diasSemana.map((dia) => (
                      <FormField
                        key={dia.id}
                        control={form.control}
                        name="diasRepeticion"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={dia.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(dia.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value || [], dia.id])
                                      : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== dia.id
                                        )
                                      )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {dia.label}
                              </FormLabel>
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
            
          </CardContent>
        </Card>

        <Button type="submit">
          Crear Horario
        </Button>
      </form>
    </Form>
  )
}


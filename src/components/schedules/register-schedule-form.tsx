'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
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

const diasSemana = [
  { id: 'lunes', label: 'Lunes' },
  { id: 'martes', label: 'Martes' },
  { id: 'miercoles', label: 'Miércoles' },
  { id: 'jueves', label: 'Jueves' },
  { id: 'viernes', label: 'Viernes' },
  { id: 'sabado', label: 'Sábado' },
  { id: 'domingo', label: 'Domingo' },
]

const formSchema = z.object({
  cursoId: z.string({
    required_error: 'Por favor seleccione un curso.',
  }),
  fechaInicio: z.date({
    required_error: 'La fecha de inicio es requerida.',
  }),
  fechaFin: z.date({
    required_error: 'La fecha de finalización es requerida.',
  }),
  horaInicio: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Formato de hora inválido. Use HH:MM.',
  }),
  horaFin: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Formato de hora inválido. Use HH:MM.',
  }),
  salon: z.string().min(1, 'El salón es requerido.'),
  diasRepeticion: z.array(z.string()).optional(),
  capacidad: z.number().int().positive().optional(),
}).refine((data) => data.fechaInicio <= data.fechaFin, {
  message: 'La fecha de inicio debe ser anterior o igual a la fecha de finalización.',
  path: ['fechaFin'],
}).refine((data) => {
  const inicio = new Date(`1970-01-01T${data.horaInicio}:00`)
  const fin = new Date(`1970-01-01T${data.horaFin}:00`)
  return inicio < fin
}, {
  message: 'La hora de inicio debe ser anterior a la hora de finalización.',
  path: ['horaFin'],
})

interface Curso {
  id: string;
  nombre: string;
}

export function CrearHorarioForm() {
  const [isLoadingCursos, setIsLoadingCursos] = useState(true)
  const [errorCursos, setErrorCursos] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cursoId: '',
      fechaInicio: new Date(),
      fechaFin: new Date(),
      horaInicio: '',
      horaFin: '',
      salon: '',
      diasRepeticion: [],
      capacidad: undefined,
    },
  })

  useEffect(() => {
    const fetchCursos = async () => {
      setIsLoadingCursos(true)
      setErrorCursos(null)
      try {
        // Simular una llamada a la API
        await new Promise(resolve => setTimeout(resolve, 1000))
        // Datos de ejemplo
        const cursosData: Curso[] = [
          { id: '1', nombre: 'Matemáticas Avanzadas' },
          { id: '2', nombre: 'Introducción a la Programación' },
          { id: '3', nombre: 'Historia del Arte' },
          { id: '4', nombre: 'Física Cuántica' },
        ]
        setCursos(cursosData)
      } catch {
        setErrorCursos('Error al cargar los cursos. Por favor, intente de nuevo.')
      } finally {
        setIsLoadingCursos(false)
      }
    }

    fetchCursos()
  }, [])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Simular una llamada a la API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log(values)
    form.reset()
  }

  const [cursos, setCursos] = useState<Curso[]>([])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Selección de Curso</CardTitle>
            <CardDescription>Elija el curso para el cual desea crear el horario.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="cursoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Curso</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un curso" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingCursos ? (
                        <SelectItem value="loading" disabled>
                          Cargando cursos...
                        </SelectItem>
                      ) : errorCursos ? (
                        <SelectItem value="error" disabled>
                          {errorCursos}
                        </SelectItem>
                      ) : (
                        cursos.map((curso) => (
                          <SelectItem key={curso.id} value={curso.id}>
                            {curso.nombre}
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
                name="fechaFin"
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
                name="horaFin"
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
            <FormField
              control={form.control}
              name="capacidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacidad (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Ej: 30"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormDescription>
                    Número máximo de participantes. Deje en blanco si no hay límite.
                  </FormDescription>
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


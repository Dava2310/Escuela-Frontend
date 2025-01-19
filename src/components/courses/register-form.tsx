'use client'

import { useRouter } from "next/navigation"; // Cambiar la importación aquí
import { useForm } from 'react-hook-form'
import { useEffect, useState } from "react"
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

import axios from 'axios'

// Esquema de validación
const formSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido'),
    codigo: z.string().min(1, 'El código es requerido'),
    descripcion: z.string().optional(),
    profesorId: z.string().min(1, 'El profesor es requerido'),
})

type Profesor = {
    id: bigint,
    nombre: string,
    apellido: string,
    cedula: string,
    email: string,
    profesion: string,
    numeroTelefono: string,
    fechaNacimiento: string,
    direccion: string,
}

import ip from "../../app/constants/constants.js";

export function CrearCursoForm() {

    const [profesores, setProfesores] = useState<Profesor[]>([])

    // Router de navegacion
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nombre: '',
            codigo: '',
            descripcion: '',
            profesorId: '',
        },
    })

    // Cargando de la tabla de profesores
    useEffect(() => {
        const fetchData_Teachers = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken");
                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }

                const response = await axios.get(`${ip}/api/teachers/`, config)
                setProfesores(response.data.body.data);

            } catch (error) {
                console.error(error);
            }
        };
        fetchData_Teachers();
    }, []);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            // Obteniendo el token de acceso
            const accessToken = localStorage.getItem("accessToken");
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            };

            // Enviando los datos del formulario
            toast.promise(axios.post(`${ip}/api/courses/`, values, config), {
                loading: 'Cargando...',
                duration: Infinity,
                success: (response) => {
                    router.push('/admin/dashboard')
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
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="nombre"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre del Curso</FormLabel>
                                <FormControl>
                                    <Input placeholder="Introducción a la Programación" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Ingrese el nombre completo del curso.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="codigo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Código del Curso</FormLabel>
                                <FormControl>
                                    <Input placeholder="PROG101" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Ingrese un código único para el curso.
                                </FormDescription>
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
                                    <Textarea
                                        placeholder="Describa el contenido y objetivos del curso..."
                                        className="resize-y"
                                        {...field}
                                    />
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
                                <FormDescription>
                                    Asigne un profesor para este curso.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit">
                        Crear Curso
                    </Button>
                </form>
            </Form>
            <Toaster richColors closeButton expand />
        </>
    )
}


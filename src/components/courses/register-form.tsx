'use client'

import { useRouter } from "next/navigation"; // Cambiar la importación aquí
import { useForm } from 'react-hook-form'
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
    categoria: z.string()
})

import ip from "../../app/constants/constants.js";

export function CrearCursoForm() {


    // Router de navegacion
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nombre: '',
            codigo: '',
            descripcion: '',
        },
    })

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
                    router.push('/admin/courses')
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
                        name="categoria"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Categoria</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione una categoria" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Programación">Programación</SelectItem>
                                        <SelectItem value="Diseño">Diseño</SelectItem>
                                        <SelectItem value="Marketing">Marketing</SelectItem>
                                        <SelectItem value="Ciencia de Datos">Ciencia de Datos</SelectItem>
                                        <SelectItem value="Arte">Arte</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Asigne una categoría para este curso.
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


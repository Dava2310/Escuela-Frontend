"use client"

import { useRouter, useParams } from "next/navigation"; // Cambiar la importación aquí
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect } from "react";

import ip from "../../app/constants/constants.js";

import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import axios from "axios";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import React from "react";

const formSchema = z.object({

    nombre: z.string(),
    apellido: z.string(),
    cedula: z.string(),
    email: z.string().email(),
    numeroTelefono: z.string(),
    direccion: z.string(),
    fechaNacimiento: z.string(),
    profesion: z.string(),
})

export function UpdateTeacherForm({ }: React.ComponentProps<"div">) {

    // Funcionalidad del Formulario

    // Router para dirigirse a la lista de estudiantes
    const router = useRouter();

    // Consiguiendo el ID de los parametros
    const params = useParams();
    const id = params.id;

    // Definicion del formulario
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nombre: '',
            apellido: '',
            cedula: '',
            email: '',
            numeroTelefono: '',
            direccion: '',
            fechaNacimiento: '',
            profesion: '',
        }
    });

    // Funcion para cargar los datos del estudiante
    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const accessToken = localStorage.getItem("accessToken");
                    const config = {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }

                    const response = await axios.get(`${ip}/api/teachers/${id}`, config);
                    form.reset(response.data.body.data);
                } catch (error) {
                    console.error(error);
                    toast.error("Error al cargar los datos del profesor");
                }
            };
            fetchData();
        }
    }, [id, form]);

    // Funcion para enviar los datos del formulario
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }

            toast.promise(axios.patch(`${ip}/api/teachers/${id}`, values, config), {
                loading: 'Cargando...',
                duration: Infinity,
                success: (response) => {

                    router.push('/admin/teachers/')
                    return `${response.data.body.message}`;
                },
                error: (error) => {
                    return `${error.response?.data?.body?.message}`;
                }
            })
        } catch (error) {
            console.error(error);
            toast.error("Error al actualizar el profesor");
        }
    }

    return (
        // Formulario de actualización de profesores
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    {/* Haciendo un div de dos columnas con grid */}
                    <div className="grid gap-4 grid-cols-2">
                        {/* Nombre */}
                        <div className="grid gap-2">
                            <FormField
                                control={form.control}
                                name="nombre"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nombre" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Apellido */}
                        <div className="grid gap-2">
                            <FormField
                                control={form.control}
                                name="apellido"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Apellido</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Apellido" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Cedula */}
                        <div className="grid gap-2">
                            <FormField
                                control={form.control}
                                name="cedula"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cedula</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Cedula" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Email */}
                        <div className="grid gap-2">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Correo</FormLabel>
                                        <FormControl>
                                            <Input placeholder="m@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Numero de Telefono */}
                        <div className="grid gap-2">
                            <FormField
                                control={form.control}
                                name="numeroTelefono"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Numero de Telefono</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Numero de Telefono" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Direccion */}
                        <div className="grid gap-2">
                            <FormField
                                control={form.control}
                                name="direccion"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Direccion</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Direccion" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Fecha de Nacimiento */}
                        <div className="grid gap-2">
                            <FormField
                                control={form.control}
                                name="fechaNacimiento"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fecha de Nacimiento</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Fecha de Nacimiento" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Profesion */}
                        <div className="grid gap-2">
                            <FormField
                                control={form.control}
                                name="profesion"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Profesion</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Profesion" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full">
                        Actualizar Profesor
                    </Button>
                </form>
            </Form>
            <Toaster richColors closeButton expand />
        </>
    )

}
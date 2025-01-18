"use client"

import { useRouter } from "next/navigation"; // Cambiar la importación aquí
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import ip from "../app/constants/constants.js";

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

const formSchema = z.object({

    nombre: z.string(),
    apellido: z.string(),
    cedula: z.string(),
    email: z.string().email(),
    password: z.string(),
    tipoUsuario: z.string(),
    direccion: z.string(),
    numeroTelefono: z.string(),
    fechaNacimiento: z.string(),
})

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {

    // Funcionalidad del Register Estudiante
    const router = useRouter();

    // Definicion del formulario
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nombre: '',
            apellido: '',
            cedula: '',
            email: '',
            password: '',
            tipoUsuario: 'estudiante',
            direccion: '',
            numeroTelefono: '',
            fechaNacimiento: '',
        }
    })

    // Funcion para enviar los datos del formulario
    function onSubmit(values: z.infer<typeof formSchema>) {

        try {
            toast.promise(axios.post(`${ip}/api/auth/register`, values), {
                loading: 'Cargando...',
                success: (response) => {
                    router.push('/login');
                    return `${response.data.body.message}`;
                },
                error: (error) => {
                    // console.log(error.response.data.body.message);
                    return `${error.response.data.body.message}`;
                }
            })
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden">
                <CardContent className="grid p-0 md:grid-cols-2">

                    {/* Formulario de Login */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center text-center">
                                    <h1 className="text-2xl font-bold">Bienvenido</h1>
                                    <p className="text-balance text-muted-foreground">
                                        Crea una cuenta para empezar
                                    </p>
                                </div>

                                {/* Nombre */}
                                <div className="grid gap-2">
                                    <FormField
                                        control={form.control}
                                        name="nombre"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nombre</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Juan Carlos" {...field} />
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
                                                    <Input placeholder="Perez Davila" {...field} />
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
                                                <FormLabel>Cédula</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="11222333" {...field} />
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

                                {/* Contraseña */}
                                <div className="grid gap-2">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Contraseña</FormLabel>
                                                <FormControl>
                                                    <Input type="password" {...field} />
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
                                                    <Input placeholder="Av..." {...field} />
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
                                                <FormLabel>Número de Teléfono</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0424-111-0102" {...field} />
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
                                                    <Input type="date" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Button type="submit" className="w-full">
                                    Registrarse
                                </Button>

                                <div className="text-center text-sm">
                                    ¿Ya tienes una cuenta?{" "}
                                    <a href="/login" className="underline underline-offset-4">
                                        Inicia Sesión
                                    </a>
                                </div>
                            </div>

                        </form>
                    </Form>


                    <div className="relative hidden bg-muted md:block">
                        {/* <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            /> */}
                    </div>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </div>
            <Toaster richColors closeButton expand />
        </div>
    )
}
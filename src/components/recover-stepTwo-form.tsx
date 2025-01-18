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

import { useEffect } from "react"

const formSchema = z.object({
    email: z.string().email(),
    preguntaSeguridad: z.string().nonempty(),
    respuestaSeguridad: z.string(),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
})

export function RecoverForm_Step2({
    className,
    ...props
}: React.ComponentProps<"div">) {

    // Funcionalidad del Login
    const router = useRouter();

    // Definicion del formulario
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            preguntaSeguridad: '',
            respuestaSeguridad: '',
            newPassword: '',
            confirmPassword: '',
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {

        try {
            toast.promise(
                axios.put(`${ip}/api/users/recover`, values),
                {
                    loading: 'Cargando...',
                    success: (response) => {

                        // Eliminando el email y el ID de usuario del localStorage
                        localStorage.removeItem("recover");
                        localStorage.removeItem("email");

                        // Direccionando a la pagina de login
                        router.push("/login");
                        return `${response.data.body.message}`;
                    },
                    error: (error) => {
                        console.error(error);
                        return `${error.response?.data?.body?.message}`;
                    },
                }
            );
        } catch (error) {
            console.error("Error during login:", error);
        }
    }

    // Funcion para recoger los datos de la pregunta de seguridad
    useEffect(() => {

        // Obteniendo el ID de usuario del paso anterior
        const recoverString = localStorage.getItem("recover");
        const recover = recoverString ? JSON.parse(recoverString) : null;

        // Obteniendo el email de usuario del paso anterior
        const emailString = localStorage.getItem("email");
        const email = emailString ? JSON.parse(emailString) : null;

        if (recover) {
            axios.get(`${ip}/api/users/recover/${recover}`)
                .then((response) => {
                    
                    // Seteando la pregunta de seguridad en el formulario
                    form.setValue("preguntaSeguridad", response.data.body.data.preguntaSeguridad);
                    
                    // Seteando el correo en el formulario
                    form.setValue("email", email);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [form]);

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden">
                <CardContent className="grid p-0">

                    {/* Formulario de Login */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center text-center">
                                    <h1 className="text-2xl font-bold">Recupera tu Contraseña</h1>
                                    <p className="text-balance text-muted-foreground">
                                        Ingresa la Respuesta de Seguridad y Cambia la Contraseña
                                    </p>
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

                                {/* Pregunta Seguridad */}
                                <div className="grid gap-2">
                                    <FormField
                                        control={form.control}
                                        name="preguntaSeguridad"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Pregunta de Seguridad</FormLabel>
                                                <FormControl>
                                                    <Input {...field} disabled />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Respuesta de Seguridad */}
                                <div className="grid gap-2">
                                    <FormField
                                        control={form.control}
                                        name="respuestaSeguridad"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Respuesta de Seguridad</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Contraseña Nueva */}
                                
                                <div className="grid gap-2">
                                    <FormField
                                        control={form.control}
                                        name="newPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nueva Contraseña</FormLabel>
                                                <FormControl>
                                                    <Input type="password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Contraseña de Confirmación */}
                                <div className="grid gap-2">
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirmar Contraseña</FormLabel>
                                                <FormControl>
                                                    <Input type="password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Button type="submit" className="w-full">
                                    Enviar
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

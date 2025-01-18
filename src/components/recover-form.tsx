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
  email: z.string().email(),
})

export function RecoverForm_Step1({
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
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
  
    try {
      toast.promise(
        axios.patch(`${ip}/api/users/recover`, values),
        {
          loading: 'Cargando...',
          success: (response) => {

            // Guardando el ID de usuario en localStorage temporalmente
            // Para en la siguiente pagina buscar con ese ID la pregunta de seguridad
            
            localStorage.setItem("recover", JSON.stringify(response.data.body.data.id));
            localStorage.setItem("email", JSON.stringify(values.email));

            // Direccionando a la pagina de recover, paso 2
            router.push("/recover/step2");

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
                    Ingresa tu correo electrónico para recuperar tu contraseña
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

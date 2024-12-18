"use client"

import { useRouter } from "next/navigation"; // Cambiar la importación aquí
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import ip from "../app/constants/constants";

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
  password: z.string()
})

export function LoginForm({
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
      password: ''
    }
  })

  // Definicion de la funcion
  function onSubmit(values: z.infer<typeof formSchema>) {

    try {
      toast.promise(axios.post(`${ip}/api/auth/login`, values), {
        loading: 'Cargando...',
        duration: Infinity,
        success: (response) => {

          localStorage.setItem("accessToken", response.data.body.data.accessToken);
          localStorage.setItem("refreshToken", response.data.body.data.refreshToken);

          console.log(localStorage.getItem("accessToken"))
          console.log(localStorage.getItem("refreshToken"))

          router.push('/dashboard/')

          return `${response.data.body.message}`;
        },
        error: (error) => {
          return `${error.response?.data?.body?.message}`;
        },

      });
    } catch (error) {
        console.log(error)
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
                    Inicia Sesión con tu cuenta
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

                {/* Contraseña */}
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <FormLabel>Contraseña</FormLabel>
                          <a
                            href="#"
                            className="ml-auto text-sm underline-offset-2 hover:underline"
                          >
                            ¿Olvidaste tu contraseña?
                          </a>
                        </div>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Iniciar Sesion
                </Button>
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

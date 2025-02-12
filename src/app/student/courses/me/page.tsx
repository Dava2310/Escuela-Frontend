"use client"

import useAuthCheck from "@/app/hooks/useAuthCheck"; // Importa el hook
import useIsStudent from "@/app/hooks/useIsStudent";

import UserMenu from "@/components/UserMenu";
import { AppSidebar } from "@/components/app-sidebar-student"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Curso = {
    id: number
    nombre: string
    codigo: string
    descripcion: string
    categoria: string
    inscrito: string
}

import axios from "axios"
import ip from '@/app/constants/constants';

export default function Page() {

    // Verifica si el usuario está autenticado
    useAuthCheck();

    // Verifica si el usuario es de tipo estudiante
    useIsStudent();

    const [cursos, setCursos] = useState<Curso[]>([])

    useEffect(() => {
        const fetchCursos = async () => {
            try {

                // Consiguiendo el token de acceso
                const accessToken = localStorage.getItem("accessToken");
                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                };

                const response = await axios.get(`${ip}/api/courses/student/enrolled/`, config)
                setCursos(response.data.body.data as Curso[])

            } catch (error) {
                console.error(error)
            }
        }

        fetchCursos();
    }, [])

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">
                                    Cursos
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Mis Cursos</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="w-full flex-1">

                    </div>
                    <UserMenu />
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <h1 className="text-3xl font-bold mb-6 text-center">Mis Cursos</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cursos.map((curso) => (
                            <Card key={curso.id} className="flex flex-col">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-xl font-semibold">{curso.nombre}</CardTitle>
                                        <Badge variant="secondary">{curso.categoria}</Badge>
                                    </div>
                                    <CardDescription className="text-sm text-muted-foreground">Código: {curso.codigo}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-sm mb-4">{curso.descripcion}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

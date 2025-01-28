"use client"

import useAuthCheck from "../../hooks/useAuthCheck"; // Importa el hook
import useIsAdmin from '../../hooks/useIsAdmin';

import UserMenu from "@/components/UserMenu";
import { AppSidebar } from "@/components/app-sidebar-admin"
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

import { useEffect } from "react";

// Librerias para la tabla de datos
import { DataTable } from "./data-table";
import { useInscripciones, InscripcionesProvider} from "./InscriptionsContext"
import { columns } from "./columns"

const ListInscripciones = () => {

    // Verifica si el usuario está autenticado
    useAuthCheck();

    // Verifica si el usuario es de tipo administrador
    useIsAdmin(); 

    const { inscripciones, fetchInscripciones } = useInscripciones();

    useEffect(() => {
        // Asegúrate de que se ejecute solo en el cliente
        if (typeof window !== 'undefined') {
            fetchInscripciones(); // Obtiene los profesores al cargar la página
        }
    }, [fetchInscripciones])

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
                                    Inscripciones
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Gestionar</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="w-full flex-1">

                    </div>
                    <UserMenu />
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <h1 className="text-4xl font-bold text-center text-blue-500">
                        Lista de Inscripciones
                    </h1>

                    <div className="container mx-auto">
                <DataTable columns={columns} data={inscripciones} />
            </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default function Page() {
    return (
        <InscripcionesProvider>
            <ListInscripciones />
        </InscripcionesProvider>
    )}

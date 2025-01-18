"use client"

import useAuthCheck from "../../../hooks/useAuthCheck"; // Importa el hook
import useIsAdmin from '../../../hooks/useIsAdmin';

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

// Importando el formulario de modificacion de profesores
import { UpdateTeacherForm } from "@/components/teachers/update-form"

export default function Page() {
    // Verifica si el usuario está autenticado
    useAuthCheck();

    // Verifica si el usuario es de tipo administrador
    useIsAdmin();
    
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
                                        Profesores
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Modificar Profesor</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <div className="w-full flex-1">
    
                        </div>
                        <UserMenu />
                    </header>
                    <div className="text-4xl font-bold text-center text-blue-500 p-6">
                        <h1>Modificar Profesor</h1>
                    </div>
                    
                    <div className="flex flex-1 flex-col gap-4 p-4">
                    <UpdateTeacherForm />
                    </div>
                    
                </SidebarInset>
            </SidebarProvider>
        )
}
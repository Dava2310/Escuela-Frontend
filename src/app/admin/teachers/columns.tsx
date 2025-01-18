/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import axios from "axios"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import ip from "@/app/constants/constants"

import {toast} from "sonner";
import { useProfesores } from "./TeachersContext"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Profesor = {
    id: bigint,
    nombre: string,
    apellido: string,
    cedula: string,
    email: string,
    numeroTelefono: string,
    fechaNacimiento: string,
    profesion: string,
}

export const columns: ColumnDef<Profesor>[] = [
    {
        accessorKey: "nombre",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nombre
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "apellido",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Apellido
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "cedula",
        header: "Cedula",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "numeroTelefono",
        header: "Num. Telefono",
    },
    {
        accessorKey: "fechaNacimiento",
        header: "Fecha Nacimiento",
    },
    {
        accessorKey: "profesion",
        header: "Profesión",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const router = useRouter()
            const teacher = row.original
            const [isDialogOpen, setIsDialogOpen] = useState(false)

            const {removeProfesor, fetchProfesores } = useProfesores();

            const handleModifyClick = useCallback(() => {
                router.push(`/admin/teachers/${teacher.id}`)
            }, [router, teacher.id])

            const handleDeleteClick = useCallback(async () => {
                try {
                    const accessToken = localStorage.getItem("accessToken")
                    const config = {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                    
                    await axios.delete(`${ip}/api/teachers/${teacher.id}`, config)
                    
                    // Actualiza el estado del contexto
                    removeProfesor(teacher.id);
                    fetchProfesores();

                    toast.success("Profesor eliminado correctamente.");
                    
                } catch (error: any) {
                    
                } finally {
                    setIsDialogOpen(false)
                }
            }, [teacher.id, removeProfesor, fetchProfesores])

            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem onClick={handleModifyClick}>
                                Modificar Datos
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                                Eliminar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Esto eliminará permanentemente al profesor y eliminará sus datos de nuestros servidores.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteClick}>Confirmar</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            )
        },
    },
]
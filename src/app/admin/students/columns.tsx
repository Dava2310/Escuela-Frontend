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
import { useEstudiantes } from "./StudentsContext"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Estudiante = {
    id: bigint,
    nombre: string,
    apellido: string,
    cedula: string,
    email: string,
    numeroTelefono: string,
    fechaNacimiento: string,
}

export const columns: ColumnDef<Estudiante>[] = [
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
        id: "actions",
        cell: ({ row }) => {
            const router = useRouter()
            const student = row.original
            const [isDialogOpen, setIsDialogOpen] = useState(false)

            const {removeEstudiante, fetchEstudiantes } = useEstudiantes();

            const handleModifyClick = useCallback(() => {
                router.push(`/admin/students/${student.id}`)
            }, [router, student.id])

            const handleDeleteClick = useCallback(async () => {
                try {
                    const accessToken = localStorage.getItem("accessToken")
                    const config = {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                    
                    await axios.delete(`${ip}/api/students/${student.id}`, config)
                    
                    // Actualiza el estado del contexto
                    removeEstudiante(student.id);
                    fetchEstudiantes();

                    toast.success("Estudiante eliminado correctamente.");
                    
                } catch (error: any) {
                    
                } finally {
                    setIsDialogOpen(false)
                }
            }, [student.id, removeEstudiante, fetchEstudiantes])

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
                                    Esta acción no se puede deshacer. Esto eliminará permanentemente al estudiante y eliminará sus datos de nuestros servidores.
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
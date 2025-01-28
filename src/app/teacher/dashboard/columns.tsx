/* eslint-disable react-hooks/rules-of-hooks */
"use client"

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
import { useCallback } from 'react'
import axios from "axios"
import ip from "@/app/constants/constants"
import { toast } from "sonner";


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
    seccionId: bigint
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
        accessorKey: 'aprobado',
        header: "Aprobado / Reprobado"
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const student = row.original
            const seccionId = student.seccionId

            const handleAprobarClick = useCallback(async () => {

                try {
                    const accessToken = localStorage.getItem("accessToken")
                    const config = {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }

                    await axios.get(`${ip}/api/secciones/${seccionId}/student/${student.id}/aprobar`, config)

                    toast.success('Estudiante aprobado.')
                } catch (error) {
                    console.error(error)
                    toast.error('No se ha podido aprobar al estudiante. Vuelva a Intentarlo.');
                }

            }, [seccionId, student.id])

            const handleNoAprobarClick = useCallback(async () => {
                try {
                    const accessToken = localStorage.getItem("accessToken")
                    const config = {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }

                    await axios.get(`${ip}/api/secciones/${seccionId}/student/${student.id}/reprobar`, config)

                    toast.info("Estudiante reprobado.")
                    
                } catch (error) {
                    console.error(error)
                    toast.error('No se ha podido reprobar al estudiante. Vuelva a Intentarlo.');
                }
            }, [seccionId, student.id])

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
                            <DropdownMenuItem onClick={handleAprobarClick}>
                                Designar Aprobado
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleNoAprobarClick}>
                                Designar Reprobado
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )
        },
    },
]
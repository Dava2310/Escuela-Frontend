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
import { useInscripciones } from "./InscriptionsContext"

export type Inscripcion = {
    id: bigint,
    referenciaPago: string,
    fechaExpedicion: string,
    banco: string,
    monto: number,
    estado: string,
    cedulaEstudiante: string,
    codigoSeccion: string
}

export const columns: ColumnDef<Inscripcion>[] = [
    {
        accessorKey: "referenciaPago",
        header: "Ref. Pago",
    },
    {
        accessorKey: "fechaExpedicion",
        header: "Fecha",
    },
    {
        accessorKey: "banco",
        header: "Banco",
    },
    {
        accessorKey: "monto",
        header: "Monto",
    },
    {
        accessorKey: "cedulaEstudiante",
        header: "C.I. Estudiante",
    },
    {
        accessorKey: "codigoSeccion",
        header: "Cod. Sección",
    },
    {
        accessorKey: "estado",
        header: "Estado",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const router = useRouter()
            const inscripcion = row.original
            const [isDialogOpen, setIsDialogOpen] = useState(false)

            const {removeInscripcion, fetchInscripciones } = useInscripciones();
            
            const handleAprobarClick = useCallback(async () => {
                try {
                    const accessToken = localStorage.getItem("accessToken")
                    const config = {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }

                    await axios.get(`${ip}/api/inscripciones/${inscripcion.id}/aprobar`, config)
                    
                    // Actualiza el estado del contexto
                    fetchInscripciones();
                    toast.success("Inscripción aprobada correctamente.");

                } catch (error: any) {
                    toast.error(error.response.data.body.message);
                }
            }, [fetchInscripciones, inscripcion.id])

            const handleNoAprobarClick = useCallback( async () => {
                try {
                    const accessToken = localStorage.getItem("accessToken")
                    const config = {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }

                    await axios.get(`${ip}/api/inscripciones/${inscripcion.id}/no_aprobar`, config)
                    
                    // Actualiza el estado del contexto
                    fetchInscripciones();
                    toast.success("Inscripción desaprobada correctamente.");

                } catch (error: any) {
                    toast.error(error.response.data.body.message);
                }

            }, [fetchInscripciones, inscripcion.id])

            const handleDeleteClick = useCallback(async () => {
                try {
                    const accessToken = localStorage.getItem("accessToken")
                    const config = {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                    
                    await axios.delete(`${ip}/api/inscripciones/${inscripcion.id}`, config)
                    
                    // Actualiza el estado del contexto
                    removeInscripcion(inscripcion.id);
                    fetchInscripciones();

                    toast.success("Inscripción eliminada correctamente.");
                    
                } catch (error: any) {
                    
                    toast.error(error.response.data.body.message);

                } finally {
                    setIsDialogOpen(false)
                }
            }, [inscripcion.id, removeInscripcion, fetchInscripciones])

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
                                Aprobar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleNoAprobarClick}>
                                No Aprobar
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
                                    Esta acción no se puede deshacer. Esto eliminará permanentemente la inscripción y eliminará sus datos de nuestros servidores.
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
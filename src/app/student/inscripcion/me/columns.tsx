"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Inscripcion = {
    id: bigint,
    referenciaPago: string,
    fechaExpedicion: string,
    banco: string,
    monto: number,
    estado: string,
    nombreCurso: string,
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
        accessorKey: "estado",
        header: "Estado",
    },
    {
        accessorKey: "nombreCurso",
        header: "Curso",
    },
]
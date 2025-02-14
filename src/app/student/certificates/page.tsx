"use client"

import useAuthCheck from "../../hooks/useAuthCheck"; // Importa el hook
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

// Tipo para los certificados del estudiante
type CertificadoEstudiante = {
    id: string
    titulo: string
    fechaExpedicion: string
    nombreCurso: string
}

import ip from "@/app/constants/constants";
import axios from "axios";

export default function Page() {

    // Verifica si el usuario está autenticado
    useAuthCheck();

    // Verifica si el usuario es de tipo estudiante
    useIsStudent();

    const [certificados, setCertificados] = useState<CertificadoEstudiante[]>([])

    const handleImprimirCertificado = async (certificadoId: string) => {
        // Lógica para imprimir el certificado
        console.log(`Imprimir certificado ${certificadoId}`)

        const accessToken = localStorage.getItem("accessToken");

        try {
            const response = await fetch(`${ip}/api/reportCertificates/${certificadoId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json' // Establece el tipo de contenido
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const blob = await response.blob(); // Obtiene la respuesta como Blob

            // Crear un enlace de descarga para el PDF
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Certificado.pdf'); // Nombre del archivo
            document.body.appendChild(link);
            link.click(); // Simula un clic en el enlace para descargar
            link.remove(); // Elimina el enlace después de la descarga
        } catch (error) {
            console.error("Error al descargar el PDF", error);
        }
    }

    useEffect(() => {

        const fetchCertificates = async () => {
            try {

                const accessToken = localStorage.getItem("accessToken");
                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                };

                const response = await axios.get(`${ip}/api/certificates/student/`, config);
                setCertificados(response.data.body.data as CertificadoEstudiante[])

            } catch (error) {
                console.error(error);
            }

        }

        fetchCertificates();

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
                                    Certificados
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Mis Certificados</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="w-full flex-1">

                    </div>
                    <UserMenu />
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <h1 className="text-3xl font-bold mb-6">Mis Certificados</h1>

                    <Card>
                        <CardHeader>
                            <CardTitle>Certificados Generados</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Título</TableHead>
                                        <TableHead>Fecha de Expedición</TableHead>
                                        <TableHead>Nombre del Curso</TableHead>
                                        <TableHead>Acción</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {certificados.map((certificado) => (
                                        <TableRow key={certificado.id}>
                                            <TableCell>{certificado.titulo}</TableCell>
                                            <TableCell>{certificado.fechaExpedicion}</TableCell>
                                            <TableCell>{certificado.nombreCurso}</TableCell>
                                            <TableCell>
                                                <Button variant="outline" size="sm" onClick={() => handleImprimirCertificado(certificado.id)}>
                                                    <Printer className="h-4 w-4 mr-2" />
                                                    Imprimir
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

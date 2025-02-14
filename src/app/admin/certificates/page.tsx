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

import { useState, useEffect } from "react"
import { FileText, Printer, Trash2, Edit } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
// Tipos
type Curso = {
    id: string
    nombre: string
    codigo: string
}

type Seccion = {
    id: string
    codigo: string
}

type Estudiante = {
    id: string
    nombre: string
    apellido: string
    correo: string
    cedula: string
    estado: "Matriculado" | "Aprobado" | "Reprobado"
}

type Certificado = {
    id: string
    titulo: string
    fechaExpedicion: string
    codigoSeccion: string
    cedulaEstudiante: string
}

import ip from "@/app/constants/constants";
import axios from "axios";

export default function Page() {

    // Verifica si el usuario está autenticado
    useAuthCheck();

    // Verifica si el usuario es de tipo administrador
    useIsAdmin();

    const router = useRouter()

    // Estados individuales para cada grupo de datos
    const [cursos, setCursos] = useState<Curso[]>([])
    const [secciones, setSecciones] = useState<{ [key: string]: Seccion[] }>({})
    const [estudiantes, setEstudiantes] = useState<{ [key: string]: Estudiante[] }>({})
    const [certificados, setCertificados] = useState<Certificado[]>([])

    const [cursoSeleccionado, setCursoSeleccionado] = useState<string | null>(null)
    const [seccionSeleccionada, setSeccionSeleccionada] = useState<string | null>(null)
    const [estudiantesSeccion, setEstudiantesSeccion] = useState<Estudiante[]>([])
    const [certificadosFiltrados, setCertificadosFiltrados] = useState<Certificado[]>([])

    // Cargar los datos desde la API una sola vez
    useEffect(() => {
        const fetchData = async () => {

            try {

                const accessToken = localStorage.getItem("accessToken");
                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }

                const response = await axios.get(`${ip}/api/certificates/`, config);

                const { cursos, secciones, estudiantes, certificados } = response.data.body;

                setCursos(cursos)
                setSecciones(secciones)
                setEstudiantes(estudiantes)
                setCertificados(certificados)
            } catch (error) {
                console.error(error);
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (seccionSeleccionada) {
            setEstudiantesSeccion(estudiantes[seccionSeleccionada] || [])
        } else {
            setEstudiantesSeccion([])
        }
    }, [seccionSeleccionada, estudiantes])

    useEffect(() => {
        if (seccionSeleccionada) {
            const seccionCodigo = secciones[cursoSeleccionado!].find((s) => s.id === seccionSeleccionada)?.codigo
            setCertificadosFiltrados(certificados.filter((c) => c.codigoSeccion === seccionCodigo))
        } else {
            setCertificadosFiltrados([])
        }
    }, [seccionSeleccionada, cursoSeleccionado, certificados, secciones])

    const handleCursoChange = (value: string) => {
        setCursoSeleccionado(value)
        setSeccionSeleccionada(null)
    }

    const handleSeccionChange = (value: string) => {
        setSeccionSeleccionada(value)
    }

    const handleGenerarCertificado = (estudianteId: string) => {
        router.push(`/admin/certificates/new/${estudianteId}/${seccionSeleccionada}`)
    }

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

    const handleEliminarCertificado = async (certificadoId: string) => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }

            const response = await axios.delete(`${ip}/api/certificates/${certificadoId}`, config);
            toast.info(response.data.body.message);
        } catch (error) {
            console.error(error);
        }
    }

    const handleModificarCertificado = (certificadoId: string) => {
        // Lógica para modificar el certificado
        console.log(`Modificar certificado ${certificadoId}`)
    }




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
                                <BreadcrumbPage>Gestionar</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="w-full flex-1">

                    </div>
                    <UserMenu />
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <h1 className="text-4xl font-bold mb-6 text-center">Gestión de Certificados</h1>

                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Selección de Curso y Sección</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Select onValueChange={handleCursoChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar Curso..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cursos.map((curso) => (
                                            <SelectItem key={curso.id} value={curso.id}>
                                                {curso.nombre} ({curso.codigo})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select onValueChange={handleSeccionChange} disabled={!cursoSeleccionado}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar Sección..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cursoSeleccionado &&
                                            secciones[cursoSeleccionado].map((seccion) => (
                                                <SelectItem key={seccion.id} value={seccion.id}>
                                                    {seccion.codigo}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Estudiantes Matriculados</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>Correo</TableHead>
                                            <TableHead>Cédula</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead>Acción</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {estudiantesSeccion.map((estudiante) => (
                                            <TableRow key={estudiante.id}>
                                                <TableCell>{estudiante.id}</TableCell>
                                                <TableCell>{`${estudiante.nombre} ${estudiante.apellido}`}</TableCell>
                                                <TableCell>{estudiante.correo}</TableCell>
                                                <TableCell>{estudiante.cedula}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            estudiante.estado === "Aprobado"
                                                                ? "default" // O "secondary" si prefieres
                                                                : estudiante.estado === "Reprobado"
                                                                    ? "destructive"
                                                                    : "outline" // O "default" para casos no definidos
                                                        }
                                                    >
                                                        {estudiante.estado}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleGenerarCertificado(estudiante.id)}
                                                        disabled={estudiante.estado !== "Aprobado"} // Deshabilitar si no está aprobado
                                                    >
                                                        <FileText className="h-4 w-4 mr-2" />
                                                        Generar Certificado
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>
                                    Certificados Generados
                                    {seccionSeleccionada &&
                                        ` - Sección ${secciones[cursoSeleccionado!].find((s) => s.id === seccionSeleccionada)?.codigo}`}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Título</TableHead>
                                            <TableHead>Fecha de Expedición</TableHead>
                                            <TableHead>Código de Sección</TableHead>
                                            <TableHead>Cédula del Estudiante</TableHead>
                                            <TableHead>Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {certificadosFiltrados.map((certificado) => (
                                            <TableRow key={certificado.id}>
                                                <TableCell>{certificado.titulo}</TableCell>
                                                <TableCell>{certificado.fechaExpedicion}</TableCell>
                                                <TableCell>{certificado.codigoSeccion}</TableCell>
                                                <TableCell>{certificado.cedulaEstudiante}</TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        <Button variant="outline" size="sm" onClick={() => handleImprimirCertificado(certificado.id)}>
                                                            <Printer className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="outline" size="sm" onClick={() => handleEliminarCertificado(certificado.id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                        <Button disabled variant="outline" size="sm" onClick={() => handleModificarCertificado(certificado.id)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <Toaster richColors closeButton expand />
            </SidebarInset>
        </SidebarProvider>
    )
}

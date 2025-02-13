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

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from 'lucide-react'
import { EditarCursoModal } from '@/components/courses/edit-course-modal'
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
interface Curso {
    id: string
    nombre: string
    categoria: string
    codigo: string
    estado: 'activo' | 'inactivo'
    matricula: number,
    cantidadSecciones: number
}
import Link from "next/link"
import ip from "../../constants/constants.js";
import axios from 'axios';

export default function Page() {

    // Verifica si el usuario está autenticado
    useAuthCheck();

    // Verifica si el usuario es de tipo administrador
    useIsAdmin();

    const [cursos, setCursos] = useState<Curso[]>([])
    const [busqueda, setBusqueda] = useState('')
    const [filtroCategoria, setFiltroCategoria] = useState('')
    const [filtroEstado, setFiltroEstado] = useState('')
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const cursosFiltrados = cursos.filter(curso =>
        curso.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
        (filtroCategoria === '' || filtroCategoria === 'todas' || curso.categoria === filtroCategoria) &&
        (filtroEstado === '' || curso.estado === filtroEstado)
    );

    const handleEditarCurso = (cursoActualizado: Curso) => {
        setCursos(cursos.map(curso =>
            curso.id === cursoActualizado.id ? cursoActualizado : curso
        ))
    }

    const handleEliminarCurso = async (id: string) => {
        setDeletingId(id);
        try {
            const accessToken = localStorage.getItem("accessToken");
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }

            const response = await axios.delete(`${ip}/api/courses/${id}`, config);
            if (response.status === 200) {
                setCursos(cursos.filter(curso => curso.id !== id));
                toast.success("Se ha eliminado el curso.")
            }
        } catch (error) {
            console.error('Error al eliminar el curso:', error);
        }
        setDeletingId(null);
    }

    // Funcion para cargar los cursos
    useEffect(() => {
        const fetchData_Courses = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken");
                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }

                const response = await axios.get(`${ip}/api/courses/`, config)
                setCursos(response.data.body.data);
            } catch (error) {
                console.error(error)
            }
        }
        fetchData_Courses();
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
                                <BreadcrumbPage>Gestionar Cursos</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="w-full flex-1">

                    </div>
                    <UserMenu />
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <h1 className="text-3xl font-bold mb-6">Gestión de Cursos</h1>

                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <Input
                            placeholder="Buscar cursos..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="md:w-1/3"
                        />
                        <Select onValueChange={setFiltroCategoria}>
                            <SelectTrigger className="md:w-1/4">
                                <SelectValue placeholder="Filtrar por categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todas">Todas las categorías</SelectItem>
                                <SelectItem value="Programación">Programación</SelectItem>
                                <SelectItem value="Diseño">Diseño</SelectItem>
                                <SelectItem value="Marketing">Marketing</SelectItem>
                                <SelectItem value="Ciencia de Datos">Ciencia de Datos</SelectItem>
                                <SelectItem value="Arte">Arte</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select onValueChange={setFiltroEstado}>
                            <SelectTrigger className="md:w-1/4">
                                <SelectValue placeholder="Filtrar por estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos los estados</SelectItem>
                                <SelectItem value="activo">Activo</SelectItem>
                                <SelectItem value="inactivo">Inactivo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cursosFiltrados.map(curso => (
                            <Card key={curso.id} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle>{curso.nombre}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p><strong>Codigo:</strong> {curso.codigo}</p>
                                    <p><strong>Categoría:</strong> {curso.categoria}</p>
                                    <p><strong>Estudiantes Inscritos:</strong> {curso.matricula}</p>
                                    <p><strong>Secciones del Curso:</strong> {curso.cantidadSecciones}</p>
                                    <Badge variant={curso.estado === 'activo' ? 'default' : 'secondary'} className="mt-2">
                                        {curso.estado === 'activo' ? 'Activo' : 'Inactivo'}
                                    </Badge>
                                </CardContent>
                                <CardFooter className="flex justify-end mt-auto">

                                    <Button variant="outline" size="sm" asChild className="mr-2">
                                        <Link href={`/admin/secciones/${curso.id}`}>Ver Secciones</Link>
                                    </Button>

                                    <Button variant="outline" size="sm" asChild className="mr-2">
                                        <Link href={`/admin/secciones/new/${curso.id}`}>Crear Sección</Link>
                                    </Button>
                                    <EditarCursoModal curso={curso} onSave={handleEditarCurso} />
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="ml-2"
                                        onClick={() => handleEliminarCurso(curso.id)}
                                        disabled={deletingId === curso.id}
                                    >
                                        {deletingId === curso.id ? (
                                            <span className="animate-spin">⏳</span>
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
                <Toaster richColors closeButton expand />
            </SidebarInset>
        </SidebarProvider>
    )
}

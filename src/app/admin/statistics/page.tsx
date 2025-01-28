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

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts"
import { Users, BookOpen } from "lucide-react"

// Tipos de datos
type EdadDistribucion = {
    rango: string
    cantidad: number
}

type CursoPorCategoria = {
    categoria: string
    cantidad: number
}

type EstadisticasData = {
    edadDistribucion: EdadDistribucion[]
    cursosPorCategoria: CursoPorCategoria[]
    totalEstudiantes: number
    totalCursos: number
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

import ip from "@/app/constants/constants";
import axios from "axios";

export default function Page() {

    // Verifica si el usuario está autenticado
    useAuthCheck();

    // Verifica si el usuario es de tipo administrador
    useIsAdmin();

    const [estadisticas, setEstadisticas] = useState<EstadisticasData | null>(null)

    useEffect(() => {
        // Aquí es donde cargarías los datos de tu API
        // Por ahora, usaremos datos de prueba
        const fetchEstadisticas = async () => {

            try {

                const accessToken = localStorage.getItem("accessToken");
                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }

                const response = await axios.get(`${ip}/api/statistics/`, config);

                const data: EstadisticasData = {
                    edadDistribucion: response.data.body.edadDistribucion,
                    cursosPorCategoria: response.data.body.cursosPorCategoria,
                    totalCursos: response.data.body.totalCursos,
                    totalEstudiantes: response.data.body.totalEstudiantes
                }

                setEstadisticas(data);

            } catch (error) {
                console.error(error);
            }

            // Simula una llamada a la API
            // await new Promise((resolve) => setTimeout(resolve, 1000))

            // const data: EstadisticasData = {
            //     edadDistribucion: [
            //         { rango: "18-22", cantidad: 150 },
            //         { rango: "23-27", cantidad: 100 },
            //         { rango: "28-32", cantidad: 80 },
            //         { rango: "33-37", cantidad: 50 },
            //         { rango: "38+", cantidad: 20 },
            //     ],
            //     cursosPorCategoria: [
            //         { categoria: "Programación", cantidad: 30 },
            //         { categoria: "Diseño", cantidad: 25 },
            //         { categoria: "Marketing", cantidad: 20 },
            //         { categoria: "Negocios", cantidad: 15 },
            //         { categoria: "Idiomas", cantidad: 10 },
            //     ],
            //     totalEstudiantes: 400,
            //     totalCursos: 100,
            // }

            // setEstadisticas(data)
        }

        fetchEstadisticas()
    }, [])

    if (!estadisticas) {
        return <div>Cargando estadísticas...</div>
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
                                    Inicio
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Dashboard</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="w-full flex-1">

                    </div>
                    <UserMenu />
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <h1 className="text-4xl text-center font-bold mb-6">Estadísticas</h1>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* Total de estudiantes */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total de Estudiantes</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{estadisticas.totalEstudiantes}</div>
                                <p className="text-xs text-muted-foreground">Estudiantes registrados en el sistema</p>
                            </CardContent>
                        </Card>

                        {/* Total de cursos activos */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total de Cursos Activos</CardTitle>
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{estadisticas.totalCursos}</div>
                                <p className="text-xs text-muted-foreground">Cursos disponibles actualmente</p>
                            </CardContent>
                        </Card>

                        {/* Promedio de edad y distribución */}
                        <Card className="col-span-full">
                            <CardHeader>
                                <CardTitle>Distribución de Edades de Estudiantes</CardTitle>
                                <CardDescription>Rango de edades de los estudiantes registrados</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={estadisticas.edadDistribucion}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="rango" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="cantidad" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Distribución de cursos por categoría */}
                        <Card className="col-span-full md:col-span-2">
                            <CardHeader>
                                <CardTitle>Cursos por Categoría</CardTitle>
                                <CardDescription>Cantidad de cursos en cada categoría</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={estadisticas.cursosPorCategoria} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis dataKey="categoria" type="category" width={150} />
                                        <Tooltip />
                                        <Bar dataKey="cantidad" fill="#82ca9d" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Relación cursos por categoría (porcentaje) */}
                        <Card className="col-span-full md:col-span-1">
                            <CardHeader>
                                <CardTitle>Distribución de Cursos por Categoría</CardTitle>
                                <CardDescription>Porcentaje de participación de cada categoría</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={400}>
                                    <PieChart>
                                        <Pie
                                            data={estadisticas.cursosPorCategoria}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="cantidad"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {estadisticas.cursosPorCategoria.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend
                                            formatter={(value, entry, index) =>
                                                estadisticas.cursosPorCategoria[index % estadisticas.cursosPorCategoria.length].categoria
                                            }
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </div>

            </SidebarInset>
        </SidebarProvider>
    )
}

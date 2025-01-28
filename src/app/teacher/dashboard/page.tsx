/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import useAuthCheck from "@/app/hooks/useAuthCheck"
import useIsTeacher from "@/app/hooks/useIsTeacher"
import UserMenu from "@/components/UserMenu"

import { useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar-teacher"
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

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, Label } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import axios from "axios"
import ip from "@/app/constants/constants"

// Librerias para la tabla de datos
import { DataTable } from "./data-table";
import { useEstudiantes, EstudiantesProvider } from "./StudentsContext"
import { columns } from "./columns"
import { Toaster } from "@/components/ui/sonner";

// Tipos
type Estudiante = {
    id: bigint;
    nombre: string;
    apellido: string;
    cedula: string;
    email: string;
    numeroTelefono: string;
    fechaNacimiento: string;
	seccionId: bigint;
};


type Seccion = {
	id: bigint
	codigo: string
	nombre: string
	horario: {
		fechaInicio: string
		fechaFin: string
		horaInicio: string
		horaFin: string
		dias: string[]
	}
	capacidad: number
	estudiantesInscritos: number
	estudiantes: Estudiante[]
}

// // Datos de prueba
// const secciones: Seccion[] = [
// 	{
// 		id: BigInt(1),
// 		codigo: "MAT101",
// 		nombre: "Matemáticas Básicas",
// 		horario: {
// 			fechaInicio: "2023-09-01",
// 			fechaFin: "2023-12-15",
// 			horaInicio: "08:00",
// 			horaFin: "10:00",
// 			dias: ["Lunes", "Miércoles"],
// 		},
// 		capacidad: 30,
// 		estudiantesInscritos: 25,
// 		estudiantes: [
// 			{ id: "1", nombre: "Ana García", email: "ana@example.com" },
// 			{ id: "2", nombre: "Carlos Pérez", email: "carlos@example.com" },
// 			{ id: "3", nombre: "Laura Martínez", email: "laura@example.com" },
// 		],
// 	},
// 	{
// 		id: BigInt(2),
// 		codigo: "FIS201",
// 		nombre: "Física Avanzada",
// 		horario: {
// 			fechaInicio: "2023-09-01",
// 			fechaFin: "2023-12-15",
// 			horaInicio: "10:30",
// 			horaFin: "12:30",
// 			dias: ["Martes", "Jueves"],
// 		},
// 		capacidad: 25,
// 		estudiantesInscritos: 22,
// 		estudiantes: [
// 			{ id: "4", nombre: "David Rodríguez", email: "david@example.com" },
// 			{ id: "5", nombre: "Elena Sánchez", email: "elena@example.com" },
// 			{ id: "6", nombre: "Fernando López", email: "fernando@example.com" },
// 		],
// 	},
// ]

const COLORS = ["#0088FE", "#FFBB28"]

const TeacherDashboard = () => {

	// Verifica si el usuario está autenticado
	useAuthCheck();

	// Verifica si el usuario es de tipo administrador
	useIsTeacher();
	const [seccionSeleccionada, setSeccionSeleccionada] = useState<Seccion | null>(null)

	const { estudiantes, setEstudiantes } = useEstudiantes();
	const [secciones, setSecciones] = useState<Seccion[]>([])

	useEffect(() => {

		const fetchSecciones = async () => {
			try {
				const accessToken = localStorage.getItem("accessToken");
				const config = {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				};

				const response = await axios.get(`${ip}/api/secciones/teacher/`, config);
				setSecciones(response.data.body.data as Seccion[])

			} catch (error: any) {
				console.error("Error fetching data:", error);
			}
		}

		fetchSecciones();

	}, [])


	const handleSeleccionSeccion = (seccionId: string) => {
		const seccion = secciones.find((s) => s.id.toString() === seccionId)
		setSeccionSeleccionada(seccion || null)
		setEstudiantes(seccion?.estudiantes as Estudiante[]);
	}

	const datosCapacidad = useMemo(() => {
		if (!seccionSeleccionada) return []
		return [
			{ name: "Inscritos", value: seccionSeleccionada.estudiantesInscritos },
			{ name: "Disponibles", value: seccionSeleccionada.capacidad - seccionSeleccionada.estudiantesInscritos },
		]
	}, [seccionSeleccionada])

	const chartConfig = {
		inscritos: {
			label: "Estudiantes Inscritos",
			color: "hsl(var(--chart-1))",
		},
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
					<h1 className="text-3xl font-bold mb-6">Dashboard del Profesor</h1>

					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						<Card className="col-span-full">
							<CardHeader>
								<CardTitle>Seleccionar Sección</CardTitle>
							</CardHeader>
							<CardContent>
								<Select onValueChange={handleSeleccionSeccion}>
									<SelectTrigger>
										<SelectValue placeholder="Seleccione una sección" />
									</SelectTrigger>
									<SelectContent>
										{secciones.map((seccion) => (
											<SelectItem key={seccion.id.toString()} value={seccion.id.toString()}>
												{seccion.codigo} - {seccion.nombre}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</CardContent>
						</Card>

						{seccionSeleccionada && (
							<>
								<Card>
									<CardHeader>
										<CardTitle>Detalles de la Sección</CardTitle>
									</CardHeader>
									<CardContent>
										<p>
											<strong>Código:</strong> {seccionSeleccionada.codigo}
										</p>
										<p>
											<strong>Nombre:</strong> {seccionSeleccionada.nombre}
										</p>
										<p>
											<strong>Capacidad:</strong> {seccionSeleccionada.capacidad}
										</p>
										<p>
											<strong>Estudiantes Inscritos:</strong> {seccionSeleccionada.estudiantesInscritos}
										</p>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Horario</CardTitle>
									</CardHeader>
									<CardContent>
										{seccionSeleccionada.horario ? (
											<>
												<p>
													<strong>Fecha de inicio:</strong> {seccionSeleccionada.horario.fechaInicio}
												</p>
												<p>
													<strong>Fecha de fin:</strong> {seccionSeleccionada.horario.fechaFin}
												</p>
												<p>
													<strong>Hora de inicio:</strong> {seccionSeleccionada.horario.horaInicio}
												</p>
												<p>
													<strong>Hora de fin:</strong> {seccionSeleccionada.horario.horaFin}
												</p>
												<div className="mt-2">
													<strong>Días:</strong>{" "}
													{seccionSeleccionada.horario.dias.map((dia) => (
														<Badge key={dia} variant="secondary" className="mr-1">
															{dia}
														</Badge>
													))}
												</div>
											</>
										) : (
											<p className="text-gray-500 italic">Esta sección no tiene horario.</p>
										)}
									</CardContent>
								</Card>

								<Card className="flex flex-col">
									<CardHeader className="items-center pb-0">
										<CardTitle>Capacidad de la Sección</CardTitle>
										<CardDescription>
											{seccionSeleccionada.codigo} - {seccionSeleccionada.nombre}
										</CardDescription>
									</CardHeader>
									<CardContent className="flex-1 pb-0">
										<ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
											<PieChart>
												<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
												<Pie
													data={datosCapacidad}
													dataKey="value"
													nameKey="name"
													innerRadius={60}
													outerRadius={80}
													paddingAngle={5}
													strokeWidth={5}
												>
													{datosCapacidad.map((entry, index) => (
														<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
													))}
													<Label
														content={({ viewBox }) => {
															if (viewBox && "cx" in viewBox && "cy" in viewBox) {
																return (
																	<text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
																		<tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
																			{seccionSeleccionada.capacidad}
																		</tspan>
																		<tspan
																			x={viewBox.cx}
																			y={(viewBox.cy || 0) + 24}
																			className="fill-muted-foreground text-sm"
																		>
																			Capacidad
																		</tspan>
																	</text>
																)
															}
														}}
													/>
												</Pie>
											</PieChart>
										</ChartContainer>
									</CardContent>
									<CardFooter className="flex-col gap-2 text-sm">
										<div className="leading-none text-muted-foreground">
											Inscritos: {seccionSeleccionada.estudiantesInscritos} de {seccionSeleccionada.capacidad}
										</div>
									</CardFooter>
								</Card>

								<Card className="col-span-full">
									<CardHeader>
										<CardTitle>Estudiantes Matriculados</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="container mx-auto">
											<DataTable columns={columns} data={estudiantes} />
										</div>
									</CardContent>
								</Card>
							</>
						)}
					</div>
				</div>
				<Toaster richColors closeButton expand />
			</SidebarInset>
		</SidebarProvider>
	)
}

export default function Page() {
	return (
		<EstudiantesProvider>
			<TeacherDashboard />
		</EstudiantesProvider>
	)
}

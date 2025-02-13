import * as React from "react"
import { GalleryVerticalEnd, Minus, Plus } from "lucide-react"

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarRail,
} from "@/components/ui/sidebar"

// Updated sample data
const data = {
	navMain: [
		{
			title: "Perfil",
			url: "#",
			items: [
				{
					title: "Cambiar Contraseña",
					url: "/student/change-password",
				},
				{
					title: "Modificar Datos",
					url: "/student/change-data",
				},
			],
		},
		{
			title: "Cursos",
			url: "#",
			items: [
				{
					title: "Ver Todos los Cursos",
					url: "/student/courses",
				},
				{
					title: "Mis Cursos",
					url: "/student/courses/me",
				},
			],
		},
		{
			title: "Inscripciones",
			url: "#",
			items: [
				{
					title: "Mis Inscripciones",
					url: "/student/inscripcion/me",
				},
			],
		},
		{
			title: "Certificados",
			url: "#",
			items: [
				{
					title: "Mis Certificados",
					url: "/student/certificates",
				},
			],
		},
	],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<a href="#">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<GalleryVerticalEnd className="size-4" />
								</div>
								<div className="flex flex-col gap-0.5 leading-none">
									<span className="font-semibold">Modo: Estudiante</span>
									<span className="">v1.0.0</span>
								</div>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						{data.navMain.map((item, index) => (
							<Collapsible
								key={item.title}
								defaultOpen={index === 1}
								className="group/collapsible"
							>
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton>
											{item.title}{" "}
											<Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
											<Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
										</SidebarMenuButton>
									</CollapsibleTrigger>
									{item.items?.length ? (
										<CollapsibleContent>
											<SidebarMenuSub>
												{item.items.map((item) => (
													<SidebarMenuSubItem key={item.title}>
														<SidebarMenuSubButton
															asChild
														>
															<a href={item.url}>{item.title}</a>
														</SidebarMenuSubButton>
													</SidebarMenuSubItem>
												))}
											</SidebarMenuSub>
										</CollapsibleContent>
									) : null}
								</SidebarMenuItem>
							</Collapsible>
						))}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	)
}

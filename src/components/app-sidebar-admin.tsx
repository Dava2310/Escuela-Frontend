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

// This is sample data.
const data = {
  navMain: [
    {
      title: "Inicio",
      url: "#",
      items: [
        {
          title: "Página de Inicio",
          url: "/admin/dashboard"
        }
      ]
      
    },
    {
      title: "Perfil",
      url: "#",
      items: [
        {
          title: "Cambiar Contraseña",
          url: "/admin/change-password",
        },
        {
          title: "Modificar Datos",
          url: "/admin/change-data",
        },
      ],
    },
    {
      title: "Estudiantes",
      url: "#",
      items: [
        {
          title: "Gestionar Estudiantes",
          url: "/admin/students/",
        },
      ],
    },
    {
      title: "Profesores",
      url: "#",
      items: [
        {
          title: "Gestionar Profesores",
          url: "/admin/teachers/",
        },
        {
          title: "Registrar Profesor",
          url: "/admin/teachers/new",
        },
      ],
    },
    {
      title: "Cursos",
      url: "#",
      items: [
        {
          title: "Gestionar Cursos",
          url: "/admin/courses",
        },
        {
          title: "Crear Curso",
          url: "/admin/courses/new",
        },
      ],
    },
    {
      title: "Horarios",
      url: "#",
      items: [
        {
          title: "Gestionar Horarios",
          url: "/admin/schedules",
        },
        {
          title: "Crear Horarios",
          url: "/admin/schedules/new",
        },
      ],
    },
    
    {
      title: "Inscripciones",
      url: "#",
      items: [
        {
          title: "Gestionar Inscripciones",
          url: "/admin/inscriptions",
        },
      ],
    },
    {
      title: "Estadísticas",
      url: "#",
      items: [
        {
          title: "Visualizar Estadísticas",
          url: "/admin/statistics",
        },
      ],
    },
    {
      title: "Certificados",
      url: "#",
      items: [
        {
          title: "Gestionar Certificados",
          url: "/admin/certificates",
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
                  <span className="font-semibold">Modo: Admin</span>
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
            {data.navMain.map((item) => (
              <Collapsible
                key={item.title}
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

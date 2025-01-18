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
        {
          title: "Registrar Estudiante",
          url: "#",
          isActive: true,
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
          url: "#",
        },
        {
          title: "Crear Curso",
          url: "#",
        },
      ],
    },
    {
      title: "Inscripciones",
      url: "#",
      items: [
        {
          title: "Gestionar Inscripciones",
          url: "#",
        },
      ],
    },
    {
      title: "Certificados",
      url: "#",
      items: [
        {
          title: "Gestionar Certificados",
          url: "#",
        },
        {
          title: "Generar Certificado",
          url: "#",
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
                              isActive={item.isActive}
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
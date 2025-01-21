'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Curso {
    id: string
    nombre: string
    categoria: string
    codigo: string
    estado: 'activo' | 'inactivo'
    matricula: number
}

import ip from "../../app/constants/constants.js";
import { toast } from "sonner";
import axios from 'axios';

interface EditarCursoModalProps {
    curso: Curso
    onSave: (cursoActualizado: Curso) => void
}

export function EditarCursoModal({ curso, onSave }: EditarCursoModalProps) {
    const [cursoEditado, setCursoEditado] = useState<Curso>(curso)


    const handleChange = (campo: keyof Curso, valor: string | number) => {
        setCursoEditado(prev => ({ ...prev, [campo]: valor }))
    }

    // Funcion para subir la actualización de datos a la API
    const handleSubmit = async () => {
        try {

            // Consiguiendo el accessToken
            const accessToken = localStorage.getItem("accessToken");
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }

            const values = {
                nombre: cursoEditado.nombre,
                codigo: cursoEditado.codigo,
                categoria: cursoEditado.categoria,
            }

            toast.promise(axios.patch(`${ip}/api/courses/${cursoEditado.id}`, values, config), {
                loading: 'Cargando...',
                duration: Infinity,
                success: (response) => {
                    onSave(cursoEditado);
                    return `${response.data.body.message}`;
                },
                error: (error) => {
                    return `${error.response?.data?.body?.message}`;
                }
            })

        } catch (error) {
            console.error('Error al actualizar el curso:', error);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                    </svg>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Curso</DialogTitle>
                    <DialogDescription>
                        Realiza cambios en la información del curso aquí. Haz clic en guardar cuando hayas terminado.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="nombre" className="text-right">
                            Nombre
                        </Label>
                        <Input
                            id="nombre"
                            value={cursoEditado.nombre}
                            onChange={(e) => handleChange('nombre', e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="categoria" className="text-right">
                            Categoría
                        </Label>
                        <Select
                            onValueChange={(value) => handleChange('categoria', value)}
                            defaultValue={cursoEditado.categoria}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Selecciona una categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Programación">Programación</SelectItem>
                                <SelectItem value="Diseño">Diseño</SelectItem>
                                <SelectItem value="Marketing">Marketing</SelectItem>
                                <SelectItem value="Ciencia de Datos">Ciencia de Datos</SelectItem>
                                <SelectItem value="Arte">Arte</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="codigo" className="text-right">
                            Codigo
                        </Label>
                        <Input
                            id="codigo"
                            value={cursoEditado.codigo}
                            onChange={(e) => handleChange('codigo', e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit}>Guardar cambios</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


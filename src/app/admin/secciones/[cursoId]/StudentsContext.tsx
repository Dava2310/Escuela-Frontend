/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import ip from '@/app/constants/constants';
import { Toaster } from "@/components/ui/sonner";

export type Estudiante = {
    id: bigint,
    nombre: string,
    apellido: string,
    cedula: string,
    email: string,
    numeroTelefono: string,
    fechaNacimiento: string,
}

interface EstudianteContextProps {
    estudiantes: Estudiante[];
    fetchEstudiantes: (seccionId: number) => void;
    removeEstudiante: (id: bigint) => void;
}

const EstudiantesContext = createContext<EstudianteContextProps | undefined>(undefined);

export const useEstudiantes = () => {
    const context = useContext(EstudiantesContext);
    if (!context) {
        throw new Error('useEstudiantes debe usarse dentro de un EstudiantesProvider');
    }
    return context;
};

export const EstudiantesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);

    const fetchEstudiantes = useCallback(async (seccionId: number) => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            };
            const response = await axios.get(`${ip}/api/secciones/${seccionId}/students`, config);

            if (response.data.status === 200) {
                setEstudiantes(response.data.body.data as Estudiante[]);
            } 

        } catch (error: any) {
            setEstudiantes([])
            console.error("Error fetching data:", error);
        }
    }, []);

    const removeEstudiante = useCallback((id: bigint) => {
        setEstudiantes((prev) => prev.filter((estudiante) => estudiante.id !== id));
    }, []);

    return (
        <>
            <EstudiantesContext.Provider value={{ estudiantes, fetchEstudiantes, removeEstudiante }}>
                {children}
            </EstudiantesContext.Provider>
            <Toaster richColors closeButton expand />
        </>

    );
};
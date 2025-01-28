/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import ip from '@/app/constants/constants';
import { Toaster } from "@/components/ui/sonner";

export type Estudiante = {
    id: bigint;
    nombre: string;
    apellido: string;
    cedula: string;
    email: string;
    numeroTelefono: string;
    fechaNacimiento: string;
    seccionId: bigint
};

interface EstudianteContextProps {
    estudiantes: Estudiante[];
    setEstudiantes: React.Dispatch<React.SetStateAction<Estudiante[]>>;
    fetchEstudiantes: () => void;
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

    const fetchEstudiantes = useCallback(async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            };
            const response = await axios.get(`${ip}/api/students`, config);
            setEstudiantes(response.data.body.data as Estudiante[]);
        } catch (error: any) {
            console.error("Error fetching data:", error);
        }
    }, []);

    const removeEstudiante = useCallback((id: bigint) => {
        setEstudiantes((prev) => prev.filter((estudiante) => estudiante.id !== id));
    }, []);

    return (
        <>
            <EstudiantesContext.Provider
                value={{
                    estudiantes,
                    setEstudiantes, // Exponemos setEstudiantes directamente
                    fetchEstudiantes,
                    removeEstudiante,
                }}
            >
                {children}
            </EstudiantesContext.Provider>
            <Toaster richColors closeButton expand />
        </>
    );
};

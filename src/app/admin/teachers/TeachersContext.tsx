/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import ip from '@/app/constants/constants';
import { Toaster } from "@/components/ui/sonner";

export type Profesor = {
    id: bigint,
    nombre: string,
    apellido: string,
    cedula: string,
    email: string,
    numeroTelefono: string,
    fechaNacimiento: string,
    profesion: string
}

interface ProfesorContextProps {
    profesores: Profesor[];
    fetchProfesores: () => void;
    removeProfesor: (id: bigint) => void;
}

const ProfesoresContext = createContext<ProfesorContextProps | undefined>(undefined);

export const useProfesores = () => {
    const context = useContext(ProfesoresContext);
    if (!context) {
        throw new Error('useProfesores debe usarse dentro de un ProfesoresProvider');
    }
    return context;
};

export const ProfesoresProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [profesores, setProfesores] = useState<Profesor[]>([]);

    const fetchProfesores = useCallback(async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            };
            const response = await axios.get(`${ip}/api/teachers`, config);
            setProfesores(response.data.body.data as Profesor[]);
        } catch (error: any) {
            console.error("Error fetching data:", error);
        }
    }, []);

    const removeProfesor = useCallback((id: bigint) => {
        setProfesores((prev) => prev.filter((profesor) => profesor.id !== id));
    }, []);

    return (
        <>
            <ProfesoresContext.Provider value={{ profesores, fetchProfesores, removeProfesor }}>
                {children}
            </ProfesoresContext.Provider>
            <Toaster richColors closeButton expand />
        </>

    );
};
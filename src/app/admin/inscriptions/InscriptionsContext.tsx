/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import ip from '@/app/constants/constants';
import { Toaster } from "@/components/ui/sonner";

export type Inscripcion = {
    id: bigint,
    referenciaPago: string,
    fechaExpedicion: string,
    banco: string,
    monto: number,
    estado: string,
    cedulaEstudiante: string,
    codigoSeccion: string
}

interface InscripcionContextProps {
    inscripciones: Inscripcion[];
    fetchInscripciones: () => void;
    removeInscripcion: (id: bigint) => void;
}

const InscripcionesContext = createContext<InscripcionContextProps | undefined>(undefined);

export const useInscripciones = () => {
    const context = useContext(InscripcionesContext);
    if (!context) {
        throw new Error('useInscripciones debe usarse dentro de un InscripcionesProvider');
    }
    return context;
};

export const InscripcionesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);

    const fetchInscripciones = useCallback(async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            };
            const response = await axios.get(`${ip}/api/inscripciones`, config);
            setInscripciones(response.data.body.data as Inscripcion[]);
        } catch (error: any) {
            console.error("Error fetching data:", error);
        }
    }, []);

    const removeInscripcion = useCallback((id: bigint) => {
        setInscripciones((prev) => prev.filter((inscripcion) => inscripcion.id !== id));
    }, []);

    return (
        <>
            <InscripcionesContext.Provider value={{ inscripciones, fetchInscripciones, removeInscripcion }}>
                {children}
            </InscripcionesContext.Provider>
            <Toaster richColors closeButton expand />
        </>

    );
};
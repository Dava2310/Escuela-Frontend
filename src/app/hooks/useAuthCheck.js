/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import ip from '../constants/constants';

const useAuthCheck = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    throw new Error('No token found');
                }

                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };

                const response = await axios.get(`${ip}/api/auth/verify-token`, config);

                if (response.status !== 200) {
                    throw new Error('Token not valid');
                }

            } catch (error) {
                setIsAuthenticated(false);
            }
        };

        // Comprueba la autenticación al cargar la página y cada cierto tiempo
        checkAuth();
        const interval = setInterval(checkAuth, 15 * 60 * 1000); // cada 15 minutos

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    return isAuthenticated;
};

export default useAuthCheck;

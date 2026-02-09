import axios from 'axios';
import { authStore } from '../auth/authStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1337';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar token em todas as requisições
apiClient.interceptors.request.use(
    (config) => {
        const token = authStore.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor para tratar 401 (não autorizado)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            authStore.logout();
            window.location.href = '/login?session=expired';
        }
        return Promise.reject(error);
    }
);

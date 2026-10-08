import axios from "axios";

export const http = axios.create({
    baseURL: `${import.meta.env.VITE_APP_URL_SERVER}/api/`,
    timeout: 30000,
    headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

type UnauthorizedListener = () => void;
const unauthorizedListeners: UnauthorizedListener[] = [];

export function onUnauthorized(listener: UnauthorizedListener): () => void {
    unauthorizedListeners.push(listener);
    return () => {
        const index = unauthorizedListeners.indexOf(listener);
        if (index !== -1) unauthorizedListeners.splice(index, 1);
    };
}

// Interceptor de REQUISIÇÃO - adiciona token automaticamente
http.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor de RESPOSTA - trata erro 401 (token expirado/inválido)
http.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            unauthorizedListeners.forEach(fn => {
                try {
                    fn();
                } catch {}
            });
        }
        return Promise.reject(error);
    }
);

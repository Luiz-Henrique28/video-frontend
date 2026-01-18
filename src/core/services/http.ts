import axios from "axios";
import router from "../router";

export const http = axios.create({
    baseURL: `${import.meta.env.VITE_APP_URL_SERVER}/api/`,
    timeout: 30000,
    headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

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
            router.push('/');
        }
        return Promise.reject(error);
    }
);
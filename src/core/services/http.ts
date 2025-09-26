import axios from "axios";

export const http = axios.create({

    baseURL: 'http://localhost:8000/api',
    timeout: 30000,
    // withCredentials: true, // só se você usar cookies de sessão
    headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
})
import { defineStore } from 'pinia'

import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../../../firebase";

import { http } from "../../../core/services/http";
import router from '../../../core/router';
import { type UserModel } from '../../post/services/post.api';

type Status = 'initial' | 'ready' | 'loading' | 'canceled' | 'success' | 'error';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as UserModel | null,
        token: '' as string,
        status: 'initial' as Status,
        error: '' as string
    }),
    actions: {
        async handleGoogleLogin() {

            try {
                // in here open popup
                const result = await signInWithPopup(auth, googleProvider);
                const token = await result.user.getIdToken();

                this.status = 'loading'
                
                const response = await http.post(`auth/firebase`, {
                    firebase_token: token
                });

                if (!response?.data?.token || !response?.data?.user) {
                    throw new Error('Resposta inválida do servidor');
                }

                this.status = 'success';
                this.user = response.data.user;
                this.token = response.data.token;

                localStorage.setItem('token', response.data.token);

                router.push('/home');

            } catch (error) {
                console.error("Erro completo:", error);
                this.error = String(error)
            }
        },

        async fetchUser() {
            try {
                const { data } = await http.get('auth/me');
                this.user = data;
            } catch (error) {
                console.error("Token inválido ao buscar user");
                this.logout();
            }
        },

        async initAuth() {
            const token = localStorage.getItem('token');

            this.status = 'ready'

            if (!token) return;

            this.token = token;

            if(window.location.pathname === '/') router.push('/home')
        },

        async logout() {

            try {
                http.post(`auth/logout`)
                await signOut(auth)
            } catch (error) {
                this.error = String(error)
            }

            this.user = null;
            this.token = '';
            this.status = 'initial';
            localStorage.removeItem('token');
            router.push('/');
        },
    },

    getters: {
        isAuthenticate: (state) => !!state.user
    }
})

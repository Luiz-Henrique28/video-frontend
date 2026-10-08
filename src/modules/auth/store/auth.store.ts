import { defineStore } from 'pinia'

import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../../../firebase";

import { http } from "../../../core/services/http";
import router from '../../../core/router';
import type { UserModel } from '../../../core/types';

/**
 * Stable per-browser identifier sent as device_name on login, so the API
 * only revokes this device's previous token instead of every session.
 */
function getDeviceName(): string {
    let id = localStorage.getItem('device_id');
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem('device_id', id);
    }
    return `web-${id}`;
}

type Status = 'initial' | 'ready' | 'loading' | 'canceled' | 'success' | 'error';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as UserModel | null,
        token: '' as string,
        status: 'initial' as Status,
        error: '' as string,
        hasCheckedAuth: false
    }),
    actions: {
        async handleGoogleLogin() {

            try {
                this.status = 'loading';
                
                // Open Firebase popup
                const result = await signInWithPopup(auth, googleProvider);
                const token = await result.user.getIdToken();

                // Send token to Laravel to validate and generate Sanctum token
                const response = await http.post(`auth/firebase`, {
                    firebase_token: token,
                    device_name: getDeviceName()
                });

                if (!response?.data?.token || !response?.data?.user) {
                    throw new Error('Invalid response from server');
                }

                this.status = 'success';
                this.user = response.data.user;
                this.token = response.data.token;

                localStorage.setItem('token', response.data.token);

                if (!response.data.user.name) return router.push('/chooseUsername');

                router.push('/home');

            } catch (error) {
                console.error("Authentication error:", error);
                this.error = String(error);
                this.status = 'error';
                
                // Ensure Firebase does not remain signed in if backend fails
                await signOut(auth).catch(() => {});
            }
        },

        async fetchUser() {
            try {
                const { data } = await http.get('auth/me');
                this.user = (data as any)?.data ?? data;
            } catch (error) {
                console.error("Invalid token when fetching user");
                await this.logout();
            }
        },

        async initAuth() {
            const token = localStorage.getItem('token');
            this.status = 'loading';

            if (!token) {
                this.hasCheckedAuth = true;
                this.status = 'ready';
                return;
            }

            this.token = token;
            await this.fetchUser();

            this.hasCheckedAuth = true;
            this.status = 'ready';
        },

        async updateUsername(newName: string) {
            const response = await http.patch('/user/username', { name: newName });
            if (this.user) {
                this.user.name = newName;
            }
            return response.data;
        },

        resetAuth() {
            this.user = null;
            this.token = '';
            this.status = 'initial';
            this.hasCheckedAuth = false;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },

        async logout() {
            try {
                if (this.token) {
                    await http.post(`auth/logout`).catch(() => {});
                }
                await signOut(auth).catch(() => {});
            } catch (error) {
                this.error = String(error);
            }

            this.resetAuth();
            router.push('/');
        },
    },

    getters: {
        isAuthenticated: (state) => !!state.user,
        hasUsername: (state) => !!state.user?.name,

        isProfileComplete(): boolean {
            return this.isAuthenticated && this.hasUsername
        }
    }
})

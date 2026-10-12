import { defineStore } from 'pinia';
import { getHiddenUsers, unblockUser } from '../services/profile.api';
import type { HiddenUserModel } from '../../../core/types';

type Status = 'initial' | 'ready' | 'loading' | 'canceled' | 'success' | 'error';

export const useHiddenUsersStore = defineStore('hiddenUsers', {
    state: () => ({
        users: [] as HiddenUserModel[],
        status: 'initial' as Status,
        nextPage: null as string | null,
        unblockingId: null as number | null,
    }),

    actions: {
        async fetchHiddenUsers() {
            try {
                this.status = 'loading';
                const result = await getHiddenUsers();
                this.users = result.data;
                this.nextPage = result.next_page_url;
                this.status = 'success';
            } catch (error) {
                this.status = 'error';
                console.error('Erro ao buscar usuários ocultos:', error);
            }
        },

        async fetchNextPage() {
            try {
                if (!this.nextPage) return;
                const result = await getHiddenUsers(this.nextPage);
                this.users.push(...result.data);
                this.nextPage = result.next_page_url;
            } catch (error) {
                this.status = 'error';
                console.error('Erro ao buscar próxima página de usuários ocultos:', error);
            }
        },

        async removeHiddenUser(userId: number) {
            try {
                this.unblockingId = userId;
                await unblockUser(userId);
                this.users = this.users.filter((u) => u.id !== userId);
            } catch (error) {
                console.error('Erro ao desbloquear usuário:', error);
            } finally {
                this.unblockingId = null;
            }
        },
    },
});

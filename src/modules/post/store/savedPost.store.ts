import { defineStore } from 'pinia';
import { getSavedPosts } from '../services/save.api';
import type { CardPostModel } from '../../../core/types';

type Status = 'initial' | 'ready' | 'loading' | 'canceled' | 'success' | 'error';

export const useSavedPostStore = defineStore('savedPost', {
    state: () => ({
        posts: [] as CardPostModel[],
        status: 'initial' as Status,
        nextPage: null as string | null
    }),

    actions: {
        async listSavedPosts() {
            try {
                this.status = 'loading';
                const result = await getSavedPosts();

                this.posts = result.data;
                this.nextPage = result.next_page_url;

                this.status = 'success';
            } catch (error) {
                this.status = 'error';
                console.error('Erro ao buscar posts salvos:', error);
            }
        },

        async getNextPage() {
            try {
                if (!this.nextPage) return;
                const result = await getSavedPosts(this.nextPage);

                this.posts.push(...result.data);
                this.nextPage = result.next_page_url;
            } catch (error) {
                this.status = 'error';
                console.error('Erro ao buscar próxima página de salvos:', error);
            }
        }
    }
});

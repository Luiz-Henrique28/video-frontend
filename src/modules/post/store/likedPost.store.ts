import { defineStore } from 'pinia';
import { getLikedPosts } from '../services/like.api';
import type { CardPostModel } from '../../../core/types';

type Status = 'initial' | 'ready' | 'loading' | 'canceled' | 'success' | 'error';

export const useLikedPostStore = defineStore('likedPost', {
    state: () => ({
        posts: [] as CardPostModel[],
        status: 'initial' as Status,
        nextPage: null as string | null
    }),

    actions: {
        async listLikedPosts() {
            try {
                this.status = 'loading';
                const result = await getLikedPosts();

                this.posts = result.data;
                this.nextPage = result.links?.next ?? null;

                this.status = 'success';
            } catch (error) {
                this.status = 'error';
                console.error('Erro ao buscar posts curtidos:', error);
            }
        },

        async getNextPage() {
            try {
                if (!this.nextPage) return;
                const result = await getLikedPosts(this.nextPage);

                this.posts.push(...result.data);
                this.nextPage = result.links?.next ?? null;
            } catch (error) {
                this.status = 'error';
                console.error('Erro ao buscar próxima página de curtidos:', error);
            }
        }
    }
});

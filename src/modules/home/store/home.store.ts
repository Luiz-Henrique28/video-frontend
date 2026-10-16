import { defineStore } from 'pinia'
import { getPosts, getNextpage } from '../services/home.api'
import type { CardPostModel } from '../../../core/types'

type Status = 'initial' | 'ready' | 'loading' | 'canceled' | 'success' | 'error';

export const useHomeStore = defineStore('home', {
    state: () => ({
        posts: [] as CardPostModel[],
        status: 'initial' as Status,
        nextPage: null as string | null
    }),
    actions: {
        async listPosts() {
            try {
                this.status = 'loading'
                const result = await getPosts()

                this.posts = result.data
                this.nextPage = result.links?.next ?? null

                this.status = 'success'
            } catch (error) {
                this.status = 'error'
            }
        },

        async getnextpage() {
            try {
                if (!this.nextPage) return 
                const posts = await getNextpage(this.nextPage)

                this.posts.push(...posts.data)
                this.nextPage = posts.links?.next ?? null
            } catch (error) {
                this.status = 'error'
            }
        }
    },
    getters: {},
})

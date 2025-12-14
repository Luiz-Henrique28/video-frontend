import { defineStore } from 'pinia'
import { getPosts, getNextpage } from '../services/home.api'
import type { CardPostModel } from '../services/home.api'

type Status = 'initial' | 'ready' | 'loading' | 'canceled' | 'success' | 'error';

export const useHomeStore = defineStore('home', {

    state: () => ({
        posts: [] as CardPostModel[],
        status: 'initial' as Status,
        nextPage: '' as string | null
    }),
    actions: {
        async listPosts() {

            try {
                this.status = 'loading'
                const result = await getPosts()

                console.log(result)

                this.posts = result.data
                this.nextPage = result.next_page_url

                this.status = 'success'
            } catch (error) {
                this.status = 'error'
            }

        },

        async getnextpage() {
            try {
                
                if(!this.nextPage) return 
                const posts = await getNextpage(this.nextPage)

                this.posts.push(...posts.data)
                this.nextPage = posts.next_page_url
                
            } catch (error) {
                this.status = 'error'
            }
        }
    },
    getters: {

    },


})
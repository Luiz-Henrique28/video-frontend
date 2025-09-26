import { defineStore } from 'pinia'
import { getPosts } from '../services/home.api'
import type { CardPostModel } from '../services/home.api'

type Status = 'initial' | 'ready' | 'loading' | 'canceled' | 'success' | 'error';

export const useCreateHomeStore = defineStore('createHome', {

    state: () => ({
        posts: [] as unknown as CardPostModel,
        status: 'initial' as Status
    }),
    actions: {
        async listPosts(){
            
            try {
                this.status = 'loading'

                const posts = await getPosts()
                this.posts = posts.data

                console.log(this.posts)

                this.status = 'success'
            } catch (error) {
                this.status = 'error'
            }
            
            
            
            

        }
    },
    getters: {
        
    },    


})
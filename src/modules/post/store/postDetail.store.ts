import { defineStore } from "pinia"
import { getPostById, addComment } from "../services/post.api"
import type { PostDetailModel } from "../services/post.api"

type Status = 'initial' | 'loading' | 'success' | 'error'

export const usePostDetailStore = defineStore('postDetail', {
    state: () => ({
        post: null as PostDetailModel | null,
        status: 'initial' as Status,
        error: null as string | null
    }),

    actions: {
        async fetchPost(id: string | number) {
            try {
                this.status = 'loading'
                this.error = null

                const result = await getPostById(id)
                this.post = result

                this.status = 'success'
            } catch (error) {
                this.status = 'error'
                this.error = 'Erro ao carregar o post'
                console.error('Erro ao buscar post:', error)
            }
        },

        async addComment(userId: number, postId: any, content: string) {
            try {
                this.status = 'loading'

                const newComment = await addComment({
                    user_id: userId,
                    post_id: postId,
                    content: content
                })

                // Atualiza o estado local adicionando o novo comentário
                if (this.post) this.post.comment.push(newComment)

                this.status = 'success'
                return true
            } catch (error) {
                this.status = 'error'
                this.error = 'Erro ao adicionar comentário'
                console.error('Erro ao adicionar comentário:', error)
                return false
            }
        }
    },

    getters: {
        hasPost: (state) => state.post !== null,
        isLoading: (state) => state.status === 'loading',
        hasError: (state) => state.status === 'error'
    }
})
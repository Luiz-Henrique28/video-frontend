import { defineStore } from "pinia"
import { getPostById, addComment } from "../services/post.api"
import { likePost, unlikePost } from "../services/like.api"
import type { PostDetailModel } from "../services/post.api"

type Status = 'initial' | 'loading' | 'success' | 'error'

export const usePostDetailStore = defineStore('postDetail', {
    state: () => ({
        post: null as PostDetailModel | null,
        status: 'initial' as Status,
        error: null as string | null,
        isTogglingLike: false
    }),

    actions: {
        async fetchPost(id: string | number) {
            try {
                this.status = 'loading'
                this.error = null
                this.post = null

                const result = await getPostById(id)
                this.post = result

                this.status = 'success'
            } catch (error) {
                this.status = 'error'
                this.error = 'Erro ao carregar o post'
                console.error('Erro ao buscar post:', error)
            }
        },

        async addComment(postId: any, content: string) {
            try {
                this.status = 'loading'

                const newComment = await addComment({
                                        post_id: postId,
                    content: content
                })

                // Atualiza o estado local adicionando o novo comentário
                if (newComment && this.post) {
                    this.post.comment.push(newComment)
                }

                this.status = 'success'
                return true
            } catch (error) {
                this.status = 'error'
                this.error = 'Erro ao adicionar comentário'
                console.error('Erro ao adicionar comentário:', error)
                return false
            }
        },

        async toggleLike() {
            if (!this.post || this.isTogglingLike) return

            this.isTogglingLike = true

            // Salva estado anterior para rollback
            const previousLiked = this.post.is_liked
            const previousCount = this.post.likes_count

            // Optimistic UI: atualiza imediatamente
            this.post.is_liked = !previousLiked
            this.post.likes_count += previousLiked ? -1 : 1

            try {
                const response = previousLiked
                    ? await unlikePost(this.post.id)
                    : await likePost(this.post.id)

                // Corrige com o valor real do servidor
                this.post.likes_count = response.likes_count
                this.post.is_liked = response.liked
            } catch (error) {
                // Rollback: reverte para o estado anterior
                this.post.is_liked = previousLiked
                this.post.likes_count = previousCount
                console.error('Erro ao curtir/descurtir:', error)
            } finally {
                this.isTogglingLike = false
            }
        }
    },

    getters: {
        hasPost: (state) => state.post !== null,
        isLoading: (state) => state.status === 'loading',
        hasError: (state) => state.status === 'error'
    }
})
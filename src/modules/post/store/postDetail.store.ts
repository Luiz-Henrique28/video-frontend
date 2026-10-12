import { defineStore } from "pinia"
import { getPostById, addComment, repostPost, unrepostPost } from "../services/post.api"
import { likePost, unlikePost } from "../services/like.api"
import { savePost, unsavePost } from "../services/save.api"
import type { PostDetailModel } from "../services/post.api"

type Status = 'initial' | 'loading' | 'success' | 'error'

export const usePostDetailStore = defineStore('postDetail', {
    state: () => ({
        post: null as PostDetailModel | null,
        status: 'initial' as Status,
        error: null as string | null,
        isTogglingLike: false,
        isTogglingSave: false,
        isTogglingRepost: false
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
        },

        async toggleSave() {
            if (!this.post || this.isTogglingSave) return

            this.isTogglingSave = true

            const previousSaved = !!this.post.is_saved
            this.post.is_saved = !previousSaved

            try {
                const response = previousSaved
                    ? await unsavePost(this.post.id)
                    : await savePost(this.post.id)

                this.post.is_saved = response.saved
            } catch (error) {
                this.post.is_saved = previousSaved
                console.error('Erro ao salvar/remover post dos salvos:', error)
            } finally {
                this.isTogglingSave = false
            }
        },

        async toggleRepost() {
            if (!this.post || this.isTogglingRepost) return

            this.isTogglingRepost = true

            const previousReposted = !!this.post.is_reposted
            const previousCount = this.post.reposts_count ?? 0

            // Optimistic UI
            this.post.is_reposted = !previousReposted
            this.post.reposts_count = Math.max(0, previousCount + (previousReposted ? -1 : 1))

            try {
                const response = previousReposted
                    ? await unrepostPost(this.post.id)
                    : await repostPost(this.post.id)

                this.post.is_reposted = response.reposted
                this.post.reposts_count = response.reposts_count
            } catch (error) {
                this.post.is_reposted = previousReposted
                this.post.reposts_count = previousCount
                console.error('Erro ao republicar/desfazer republicação:', error)
            } finally {
                this.isTogglingRepost = false
            }
        }
    },

    getters: {
        hasPost: (state) => state.post !== null,
        isLoading: (state) => state.status === 'loading',
        hasError: (state) => state.status === 'error'
    }
})
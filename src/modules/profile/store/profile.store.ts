import { defineStore } from 'pinia'
import {
    getUserProfile,
    getUserPosts,
    followUser,
    unfollowUser,
    blockUser,
    unblockUser,
    type UserProfileModel,
} from '../services/profile.api'

type Status = 'initial' | 'loading' | 'success' | 'error'

export const useProfileStore = defineStore('profile', {
    state: () => ({
        profile: null as UserProfileModel | null,
        posts: [] as any[],
        nextPage: null as string | null,
        status: 'initial' as Status,
        postsStatus: 'initial' as Status,
        error: null as string | null,
        isTogglingFollow: false,
        isTogglingBlock: false,
        currentTab: 'all' as 'all' | 'posts' | 'reposts',
    }),

    actions: {
        /**
         * Busca o perfil público de um usuário pelo username.
         * Reseta o estado ao trocar de perfil.
         */
        async fetchProfile(username: string) {
            try {
                this.status = 'loading'
                this.error = null
                this.profile = null
                this.posts = []
                this.nextPage = null
                this.currentTab = 'all'

                this.profile = await getUserProfile(username)
                this.status = 'success'
            } catch (error) {
                this.status = 'error'
                this.error = 'Erro ao carregar perfil'
                console.error('Erro ao buscar perfil:', error)
            }
        },

        /**
         * Busca os posts do usuário cujo perfil está carregado.
         */
        async fetchPosts(type: 'all' | 'posts' | 'reposts' = 'all') {
            if (!this.profile) return

            this.currentTab = type
            try {
                this.postsStatus = 'loading'
                this.posts = []
                const result = await getUserPosts(this.profile.id, 1, type)
                this.posts = result.data
                this.nextPage = result.links?.next ?? null
                this.postsStatus = 'success'
            } catch (error) {
                this.postsStatus = 'error'
                console.error('Erro ao buscar posts do perfil:', error)
            }
        },

        /**
         * Alterna o estado de follow com Optimistic UI e rollback em caso de erro.
         * Mesmo padrão do toggleLike em postDetail.store.ts.
         */
        async toggleFollow() {
            if (!this.profile || this.isTogglingFollow) return

            this.isTogglingFollow = true

            // Salva estado anterior para rollback
            const previousFollowing = this.profile.is_following
            const previousCount = this.profile.followers_count

            // Optimistic UI: atualiza imediatamente na tela
            this.profile.is_following = !previousFollowing
            this.profile.followers_count += previousFollowing ? -1 : 1

            try {
                const response = previousFollowing
                    ? await unfollowUser(this.profile.id)
                    : await followUser(this.profile.id)

                // Confirma com o valor real do servidor
                this.profile.is_following = response.following
                this.profile.followers_count = response.followers_count
            } catch (error) {
                // Rollback: reverte para o estado anterior
                this.profile.is_following = previousFollowing
                this.profile.followers_count = previousCount
                console.error('Erro ao seguir/deixar de seguir:', error)
            } finally {
                this.isTogglingFollow = false
            }
        },

        async toggleBlock(targetUser?: { id: number }) {
            const user = targetUser || this.profile
            if (!user || this.isTogglingBlock) return

            this.isTogglingBlock = true
            const previousBlocked = this.profile && this.profile.id === user.id ? !!this.profile.is_blocked : false
            if (this.profile && this.profile.id === user.id) {
                this.profile.is_blocked = !previousBlocked
            }

            try {
                const response = previousBlocked
                    ? await unblockUser(user.id)
                    : await blockUser(user.id)

                if (this.profile && this.profile.id === user.id) {
                    this.profile.is_blocked = response.blocked
                }
                if (this.profile && this.profile.hidden_count !== undefined && this.profile.id !== user.id) {
                    this.profile.hidden_count = response.hidden_count
                }
                return response
            } catch (error) {
                if (this.profile && this.profile.id === user.id) {
                    this.profile.is_blocked = previousBlocked
                }
                console.error('Erro ao alternar bloqueio de usuário:', error)
                throw error
            } finally {
                this.isTogglingBlock = false
            }
        },
    },

    getters: {
        isLoading: (state) => state.status === 'loading',
        hasError: (state) => state.status === 'error',
        hasProfile: (state) => state.profile !== null,
    },
})

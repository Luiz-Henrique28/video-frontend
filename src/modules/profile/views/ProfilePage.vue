<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../../auth/store/auth.store';
import { useProfileStore } from '../store/profile.store';
import NavBar from '../../../core/components/NavBar.vue';
import UserAvatar from '../../../core/components/UserAvatar.vue';
import PostCard from '../../home/components/PostCard.vue';
import { formatCompactNumber } from '../../../core/utils/formatters';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const profileStore = useProfileStore();

const { profile, posts, status, isTogglingFollow } = storeToRefs(profileStore);

const activeTab = ref<'all' | 'posts' | 'reposts'>('all');

// O username vem da rota (:username) ou, na rota /profile sem param, do usuário autenticado
const username = computed(() => {
    return (route.params.username as string) || authStore.user?.name || '';
});

// É o próprio perfil do usuário autenticado?
const isOwnProfile = computed(() => {
    return authStore.user?.name === profile.value?.name;
});

const handleFollow = () => {
    if (!authStore.isAuthenticated) {
        router.push('/');
        return;
    }
    profileStore.toggleFollow();
};

// Ao montar ou mudar de username, busca o perfil e os posts
const loadProfile = async (name: string) => {
    if (!name) return;
    await profileStore.fetchProfile(name);
    await profileStore.fetchPosts();
};

onMounted(() => loadProfile(username.value));

// Suporta navegação entre perfis sem recarregar o componente
watch(username, (newName) => {
    if (newName) loadProfile(newName);
});
</script>

<template>
    <NavBar />

    <div class="profile-page">

        <!-- Loading state -->
        <div v-if="status === 'loading'" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
        </div>

        <!-- Error state -->
        <div v-else-if="status === 'error'" class="text-center py-5 text-muted">
            <i class="bi bi-exclamation-circle fs-1 d-block mb-2"></i>
            <p>Usuário não encontrado</p>
        </div>

        <!-- Profile loaded -->
        <div v-else-if="profile" class="profile-header text-center py-4">

            <!-- Avatar -->
            <div class="mb-3 d-flex justify-content-center">
                <UserAvatar :name="profile.name" :avatarUrl="profile.avatar" :size="96" />
            </div>

            <!-- Username -->
            <h2 class="username mb-3">{{ profile.name }}</h2>

            <!-- Linha de Ações (Seguir / Editar + Botão Olho + Settings) -->
            <div class="d-flex align-items-center justify-content-center gap-2 mb-3">

                <!-- Perfil próprio: Editar Perfil -->
                <router-link
                    v-if="isOwnProfile"
                    to="/settings"
                    class="btn btn-sm btn-pink fw-bold d-flex align-items-center flex-shrink-0"
                >
                    <i class="bi bi-gear-fill me-1"></i> EDITAR PERFIL
                </router-link>

                <!-- Perfil alheio: botão de follow/unfollow -->
                <button
                    v-else-if="authStore.isAuthenticated"
                    class="btn btn-sm fw-bold d-flex align-items-center flex-shrink-0"
                    :class="profile.is_following ? 'btn-following-sm' : 'btn-pink'"
                    :disabled="isTogglingFollow"
                    @click="handleFollow"
                    :id="`follow-btn-${profile.id}`"
                >
                    <span v-if="isTogglingFollow" class="spinner-border spinner-border-sm me-1"></span>
                    <template v-else>
                        <i class="bi me-1" :class="profile.is_following ? 'bi-person-check-fill' : 'bi-plus-lg'"></i>
                        {{ profile.is_following ? 'SEGUINDO' : 'SEGUIR' }}
                    </template>
                </button>

                <!-- Visitante não autenticado -->
                <router-link
                    v-else
                    to="/"
                    class="btn btn-sm btn-pink fw-bold d-flex align-items-center flex-shrink-0"
                >
                    <i class="bi bi-plus-lg me-1"></i> SEGUIR
                </router-link>

                <!-- Botão de ocultar (olho) -->
                <button class="btn btn-sm btn-pink square-btn flex-shrink-0" title="Ocultar">
                    <i class="bi bi-eye-slash-fill"></i>
                </button>

                <!-- Botão de opções (dropdown) -->
                <div class="dropdown">
                    <button
                        class="btn btn-sm btn-pink square-btn flex-shrink-0"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        title="Opções"
                    >
                        <i class="bi bi-three-dots"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li>
                            <button class="dropdown-item" type="button">
                                <i class="bi bi-chat-fill"></i> Chat
                            </button>
                        </li>
                        <li>
                            <button class="dropdown-item" type="button">
                                <i class="bi bi-search"></i> Pesquisar
                            </button>
                        </li>
                        <li>
                            <button class="dropdown-item" type="button">
                                <i class="bi bi-share-fill"></i> Compartilhar
                            </button>
                        </li>
                        <li>
                            <button class="dropdown-item" type="button">
                                <i class="bi bi-flag-fill"></i> Relatar
                            </button>
                        </li>
                    </ul>
                </div>

            </div>

            <!-- Biografia do usuário (reservado para quando o campo bio existir na API) -->
            <!--
            <div class="profile-bio mb-3 text-secondary small px-3 mx-auto" style="max-width: 500px;">
                <p class="mb-0">{{ (profile as any).bio || '' }}</p>
            </div>
            -->

            <!-- Métricas do Perfil com ícones na horizontal -->
            <div class="profile-stats d-flex align-items-center justify-content-center gap-3 text-secondary small mb-4">

                <div class="d-flex align-items-center gap-1" title="Publicações">
                    <i class="bi bi-grid-fill"></i>
                    <span class="fw-bold">{{ formatCompactNumber(profile.posts_count) }}</span>
                </div>

                <div class="d-flex align-items-center gap-1" title="Visualizações">
                    <i class="bi bi-eye-fill"></i>
                    <span class="fw-bold">{{ formatCompactNumber(profile.profile_views_count) }}</span>
                </div>

                <div class="d-flex align-items-center gap-1" title="Seguidores">
                    <i class="bi bi-people-fill"></i>
                    <span class="fw-bold">{{ formatCompactNumber(profile.followers_count) }}</span>
                </div>

                <div class="d-flex align-items-center gap-1" title="Seguindo">
                    <i class="bi bi-person-check-fill"></i>
                    <span class="fw-bold">{{ formatCompactNumber(profile.following_count) }}</span>
                </div>

            </div>

        </div>

        <!-- Posts Section -->
        <div v-if="profile" class="posts-container p-3">

            <!-- Navegação entre abas (Tudo / Publicações / Reposts) -->
            <div id="tabs" class="d-flex gap-4 fs-6 mb-3 border-bottom border-secondary border-opacity-25 pb-2">
                <div
                    :class="{ 'tab-active': activeTab === 'all' }"
                    @click="activeTab = 'all'"
                    style="cursor: pointer;"
                    class="fw-bold"
                >
                    TUDO
                </div>
                <div
                    :class="{ 'tab-active': activeTab === 'posts' }"
                    @click="activeTab = 'posts'"
                    style="cursor: pointer;"
                    class="fw-bold"
                >
                    {{ formatCompactNumber(profile.posts_count) }} PUBLICAÇÕES
                </div>
                <div
                    :class="{ 'tab-active': activeTab === 'reposts' }"
                    @click="activeTab = 'reposts'"
                    style="cursor: pointer;"
                    class="fw-bold"
                >
                    0 REPOSTS
                </div>
            </div>

            <!-- Posts Grid -->
            <div v-if="posts.length === 0 && status !== 'loading'" class="text-center py-5 text-muted">
                <i class="bi bi-camera fs-1 d-block mb-2"></i>
                <p>Nenhum post ainda</p>
            </div>

            <div v-else class="row g-3 post-list">
                <template v-for="post in posts" :key="post.id">
                    <div class="col-6 col-sm-4 col-md-3 col-lg-2 mb-4">
                        <PostCard
                            class="list-unstyled"
                            :id="post.id.toString()"
                            :userId="post.user_id"
                            :thumbnail_path="post.thumbnail_path || post.first_media?.file_path"
                            :caption="post.caption"
                            :imageCount="post.image_count"
                            :videoCount="post.video_count"
                            :viewsCount="post.views_count"
                            :user="post.user || profile"
                            :hideUser="true"
                        />
                    </div>
                </template>
            </div>

        </div>

    </div>
</template>

<style scoped>
.profile-page {
    background-color: var(--bg-dark, #1a1a1a);
    min-height: 100vh;
    color: var(--text-white, #fff);
}

.username {
    color: var(--primary-color, #ff69b4);
    font-size: 1.5rem;
    font-weight: 600;
}

/* ── Botões de ação estilo PostDetail ── */
.btn-pink {
    background-color: var(--primary-color, #a855f7);
    border: none;
    border-radius: var(--radius-sm, 4px);
    color: #fff;
    font-size: 0.75rem;
    padding: 0.35rem 0.75rem;
    transition: var(--transition-normal, all 0.2s ease);
}

.btn-pink:hover {
    background-color: var(--primary-hover, #9333ea);
    color: #fff;
}

.btn-following-sm {
    background-color: transparent;
    border: 1.5px solid var(--text-muted, #a0a0a0);
    color: var(--text-muted, #a0a0a0);
    border-radius: var(--radius-sm, 4px);
    font-size: 0.75rem;
    padding: 0.35rem 0.75rem;
}

.btn-following-sm:hover:not(:disabled) {
    border-color: #ff4d6d;
    color: #ff4d6d;
}

.square-btn {
    width: 32px;
    height: 32px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

/* ── Métricas com ícones ── */
.profile-stats {
    color: var(--text-muted, #a0a0a0);
}

.profile-stats i {
    font-size: 0.95rem;
}

/* ── Abas de navegação ── */
.tab-active {
    color: var(--primary-color, #a855f7);
    border-bottom: 2px solid var(--primary-color, #a855f7);
    padding-bottom: 2px;
}

/* ── Dropdown de opções ── */
.dropdown-menu {
    background-color: var(--bg-secondary, #242424);
    border: 2px solid var(--border-color, #333);
    border-radius: var(--radius-sm, 4px);
    min-width: 180px;
    padding: 4px 0;
}

.dropdown-menu .dropdown-item {
    color: var(--text-muted, #a0a0a0);
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
    background-color: transparent;
    border: none;
    width: 100%;
    text-align: left;
    cursor: pointer;
    transition: var(--transition-normal, all 0.2s ease);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.dropdown-menu .dropdown-item:hover {
    background-color: var(--bg-card, #2a2a2a);
    color: var(--text-primary, #fff);
}


</style>

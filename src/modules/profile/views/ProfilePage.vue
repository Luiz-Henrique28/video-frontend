<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../../auth/store/auth.store';
import { useProfileStore } from '../store/profile.store';
import NavBar from '../../../core/components/NavBar.vue';
import UserAvatar from '../../../core/components/UserAvatar.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const profileStore = useProfileStore();

const { profile, posts, status, isTogglingFollow } = storeToRefs(profileStore);

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

            <!-- Stats: followers, following, posts -->
            <div class="stats d-flex justify-content-center gap-4 mb-4">
                <div class="stat-item d-flex flex-column align-items-center">
                    <span class="stat-number">{{ profile.posts_count }}</span>
                    <span class="stat-label">Posts</span>
                </div>
                <div class="stat-item d-flex flex-column align-items-center">
                    <span class="stat-number">{{ profile.followers_count }}</span>
                    <span class="stat-label">Seguidores</span>
                </div>
                <div class="stat-item d-flex flex-column align-items-center">
                    <span class="stat-number">{{ profile.following_count }}</span>
                    <span class="stat-label">Seguindo</span>
                </div>
            </div>

            <!-- Action Button -->
            <div class="mb-4">

                <!-- Perfil próprio: botão de settings -->
                <router-link
                    v-if="isOwnProfile"
                    to="/settings"
                    class="btn btn-outline-secondary btn-action"
                >
                    <i class="bi bi-three-dots me-1"></i> Editar Perfil
                </router-link>

                <!-- Perfil alheio: botão de follow/unfollow -->
                <button
                    v-else-if="authStore.isAuthenticated"
                    class="btn btn-action"
                    :class="profile.is_following ? 'btn-following' : 'btn-follow'"
                    :disabled="isTogglingFollow"
                    @click="handleFollow"
                    :id="`follow-btn-${profile.id}`"
                >
                    <span v-if="isTogglingFollow" class="spinner-border spinner-border-sm me-1"></span>
                    <span v-else>
                        <i class="bi" :class="profile.is_following ? 'bi-person-check-fill' : 'bi-person-plus-fill'"></i>
                    </span>
                    {{ profile.is_following ? 'Seguindo' : 'Seguir' }}
                </button>

                <!-- Visitante não autenticado -->
                <router-link
                    v-else
                    to="/"
                    class="btn btn-follow btn-action"
                >
                    <i class="bi bi-person-plus-fill me-1"></i> Seguir
                </router-link>
            </div>
        </div>

        <!-- Posts Grid -->
        <div v-if="profile" class="posts-container p-3">
            <div v-if="posts.length === 0 && status !== 'loading'" class="text-center py-5 text-muted">
                <i class="bi bi-camera fs-1 d-block mb-2"></i>
                <p>Nenhum post ainda</p>
            </div>

            <div v-else class="row g-2">
                <div
                    v-for="post in posts"
                    :key="post.id"
                    class="col-6 col-md-4"
                >
                    <router-link :to="`/post/${post.id}`" class="post-card">
                        <img
                            :src="post.thumbnail_path || post.first_media?.file_path"
                            :alt="post.caption"
                            class="post-thumbnail"
                            loading="lazy"
                        />
                        <div class="post-overlay">
                            <div class="post-stats d-flex gap-3">
                                <span v-if="post.image_count > 0"><i class="bi bi-camera"></i> {{ post.image_count }}</span>
                                <span v-if="post.video_count > 0"><i class="bi bi-camera-video"></i> {{ post.video_count }}</span>
                            </div>
                        </div>
                        <p class="post-caption text-truncate mt-1 mb-0 small">{{ post.caption }}</p>
                    </router-link>
                </div>
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

.avatar-wrapper {
    width: 100px;
    height: 100px;
}

.avatar-img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}

.avatar-placeholder {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #555;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    font-weight: bold;
    color: #fff;
}

.username {
    color: var(--primary-color, #ff69b4);
    font-size: 1.5rem;
    font-weight: 600;
}

.stat-item {
    min-width: 70px;
}

.stat-number {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--text-white, #fff);
}

.stat-label {
    font-size: 0.78rem;
    color: var(--text-secondary, #aaa);
}

/* ── Botões de ação ── */
.btn-action {
    border-radius: 20px;
    padding: 0.45rem 1.5rem;
    font-size: 0.9rem;
    font-weight: 600;
    transition: all 0.2s ease;
    min-width: 130px;
}

.btn-follow {
    background-color: var(--primary-color, #ff69b4);
    border: none;
    color: #fff;
}

.btn-follow:hover:not(:disabled) {
    filter: brightness(1.1);
    color: #fff;
}

.btn-following {
    background-color: transparent;
    border: 1.5px solid var(--text-secondary, #aaa);
    color: var(--text-secondary, #aaa);
}

.btn-following:hover:not(:disabled) {
    border-color: #ff4d6d;
    color: #ff4d6d;
}

/* ── Grid de posts ── */
.post-card {
    display: block;
    position: relative;
    text-decoration: none;
    color: inherit;
}

.post-thumbnail {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: 8px;
}

.post-overlay {
    position: absolute;
    bottom: 25px;
    left: 0;
    right: 0;
    padding: 0.5rem;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
    border-radius: 0 0 8px 8px;
}

.post-stats {
    color: #fff;
    font-size: 0.8rem;
}

.post-caption {
    color: var(--text-secondary, #aaa);
}
</style>

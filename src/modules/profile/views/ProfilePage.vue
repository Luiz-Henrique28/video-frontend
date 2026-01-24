<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../../auth/store/auth.store';
import { http } from '../../../core/services/http';
import NavBar from '../../../core/components/NavBar.vue';

const authStore = useAuthStore();

const activeTab = ref<'all' | 'posts' | 'reposts'>('all');
const userPosts = ref<any[]>([]);
const isLoading = ref(false);

const user = computed(() => authStore.user);

const stats = ref({
    posts: 0,
    views: 0
});

const fetchUserPosts = async () => {
    if (!user.value) return;

    isLoading.value = true;
    try {
        const response = await http.get(`/user/${user.value.id}/posts`);
        userPosts.value = response.data.data || response.data;
        stats.value.posts = userPosts.value.length;
    } catch (error) {
        console.error('Erro ao carregar posts', error);
    } finally {
        isLoading.value = false;
    }
};

const filteredPosts = computed(() => {
    if (activeTab.value === 'posts') {
        return userPosts.value.filter(p => !p.is_repost);
    } else if (activeTab.value === 'reposts') {
        return userPosts.value.filter(p => p.is_repost);
    }
    return userPosts.value;
});

const getAvatarLetter = computed(() => {
    return user.value?.name?.charAt(0).toUpperCase() || 'U';
});

onMounted(() => {
    fetchUserPosts();
});
</script>

<template>
    <NavBar />

    <div class="profile-page">
        <div class="profile-header text-center py-4">
            <!-- Avatar -->
            <div class="avatar-wrapper mx-auto mb-3">
                <img
                    v-if="user?.avatar"
                    :src="user.avatar"
                    :alt="user.name"
                    class="avatar-img"
                />
                <div v-else class="avatar-placeholder">
                    {{ getAvatarLetter }}
                </div>
            </div>

            <!-- Username -->
            <h2 class="username text-primary mb-3">{{ user?.name }}</h2>

            <!-- Action Button -->
            <router-link to="/settings" class="btn btn-dark btn-options mb-4">
                <i class="bi bi-three-dots"></i>
            </router-link>

            <!-- Stats -->
            <div class="stats d-flex justify-content-center gap-4 mb-4">
                <div class="stat-item d-flex align-items-center gap-2">
                    <i class="bi bi-grid-3x3"></i>
                    <span>{{ stats.posts }}</span>
                </div>
                <div class="stat-item d-flex align-items-center gap-2">
                    <i class="bi bi-eye"></i>
                    <span>{{ stats.views }}</span>
                </div>
            </div>

            <!-- Tabs -->
            <div class="tabs d-flex justify-content-center gap-4">
                <button
                    :class="['tab-btn', { active: activeTab === 'all' }]"
                    @click="activeTab = 'all'"
                >
                    ALL
                </button>
                <button
                    :class="['tab-btn', { active: activeTab === 'posts' }]"
                    @click="activeTab = 'posts'"
                >
                    {{ stats.posts }} POSTS
                </button>
                <button
                    :class="['tab-btn', { active: activeTab === 'reposts' }]"
                    @click="activeTab = 'reposts'"
                >
                    0 REPOSTS
                </button>
            </div>
        </div>

        <!-- Posts Grid -->
        <div class="posts-container p-3">
            <div v-if="isLoading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
            </div>

            <div v-else-if="filteredPosts.length === 0" class="text-center py-5 text-muted">
                <i class="bi bi-camera fs-1 d-block mb-2"></i>
                <p>No posts yet</p>
            </div>

            <div v-else class="row g-2">
                <div
                    v-for="post in filteredPosts"
                    :key="post.id"
                    class="col-6"
                >
                    <router-link :to="`/post/${post.id}`" class="post-card">
                        <img
                            :src="post.thumbnail_path || post.first_media?.file_path"
                            :alt="post.caption"
                            class="post-thumbnail"
                        />
                        <div class="post-overlay">
                            <div class="post-stats d-flex gap-3">
                                <span><i class="bi bi-eye"></i> {{ post.view_count || 0 }}</span>
                                <span><i class="bi bi-camera"></i> {{ post.image_count || 0 }}</span>
                            </div>
                        </div>
                        <p class="post-caption text-truncate mt-1 mb-0 small">
                            {{ post.caption }}
                        </p>
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

.btn-options {
    border-radius: 20px;
    padding: 0.5rem 1.5rem;
    background-color: #333;
    border: none;
}

.btn-options:hover {
    background-color: #444;
}

.stat-item {
    color: var(--text-secondary, #aaa);
    font-size: 1rem;
}

.tabs {
    border-bottom: 1px solid #333;
    padding-bottom: 0.5rem;
}

.tab-btn {
    background: none;
    border: none;
    color: var(--text-secondary, #aaa);
    font-size: 0.9rem;
    font-weight: 600;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: color 0.2s;
}

.tab-btn:hover {
    color: var(--text-white, #fff);
}

.tab-btn.active {
    color: var(--primary-color, #ff69b4);
    border-bottom: 2px solid var(--primary-color, #ff69b4);
}

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
    background: linear-gradient(transparent, rgba(0,0,0,0.7));
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

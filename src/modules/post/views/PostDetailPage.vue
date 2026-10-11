<template>
    <NavBar/>
    <main class="d-flex flex-column pb-5 main-content p-1">

        <div class="row mt-3 mb-2">
            <h6 class="text-secondary text-start fw-normal mb-0 fs-2">{{ post?.caption }}</h6>
        </div>

        <div id="postHeader" class="d-flex flex-wrap align-items-center justify-content-between mb-2">

            <div class="d-flex align-items-center mb-2 mb-md-0 flex-nowrap">
                <UserAvatar 
                    :name="post?.user?.name" :avatarUrl="(post?.user as any)?.avatar"  
                    :to="`/profile/${post?.user?.name}`"  
                    :size="35" class="me-2" 
                />

                <router-link
                    v-if="post?.user?.name"
                    :to="`/profile/${post?.user?.name}`"
                    class="username me-3 text-truncate"
                >
                    {{ post?.user?.name }}
                </router-link>

                <button
                    class="btn btn-sm fw-bold d-flex align-items-center me-2 flex-shrink-0"
                    :class="profileStore.profile?.is_following ? 'btn-following-sm' : 'btn-pink'"
                    :disabled="profileStore.isTogglingFollow"
                    @click="handleFollow"
                    id="post-detail-follow-btn"
                    v-if="post?.user?.id !== authStore.user?.id"
                >
                    <span v-if="profileStore.isTogglingFollow" class="spinner-border spinner-border-sm me-1"></span>
                    <template v-else>
                        <i class="bi me-1" :class="profileStore.profile?.is_following ? 'bi-person-check-fill' : 'bi-plus-lg'"></i>
                        {{ profileStore.profile?.is_following ? 'Seguindo' : 'Seguir' }}
                    </template>
                </button>

                <button v-if="post?.user?.id !== authStore.user?.id" class="btn btn-sm btn-pink square-btn flex-shrink-0">
                    <i class="bi bi-eye-slash-fill"></i>
                </button>
            </div>

            <div class="post-stats d-flex align-items-center gap-2 text-secondary small ms-auto">

                <div v-if="post && post.image_count > 0" class="d-flex align-items-center gap-1 me-1">
                    <i class="bi bi-camera-fill"></i>
                    <span>{{ post?.image_count }}</span>
                </div>

                <div v-if="post && post.video_count > 0" class="d-flex align-items-center gap-1 me-1">
                    <i class="bi bi-camera-video-fill"></i>
                    <span>{{ post?.video_count }}</span>
                </div>

                <div class="d-flex align-items-center gap-1 me-1">
                    <i class="bi bi-eye-fill"></i>
                    <span>{{ formatCompactNumber(post?.views_count) }}</span>
                </div>

                <!-- Like button com Optimistic UI -->
                <div 
                    class="action-btn d-flex align-items-center gap-1" 
                    :class="{ 'is-active': post?.is_liked }"
                    @click="handleLike" 
                    style="cursor: pointer;"
                >
                    <i class="bi" :class="post?.is_liked ? 'bi-heart-fill' : 'bi-heart'"></i>
                    <span v-if="post && post.likes_count > 0" class="small fw-bold">{{ formatCompactNumber(post.likes_count) }}</span>
                </div>

                <div class="action-btn d-flex align-items-center gap-1" style="cursor: pointer;">
                    <i class="bi bi-arrow-repeat"></i>
                    <span class="small fw-bold">5</span>
                </div>

                <div class="action-btn d-flex align-items-center justify-content-center" style="cursor: pointer;">
                    <i class="bi bi-bookmark"></i>
                </div>

                <div class="action-btn d-flex align-items-center justify-content-center" style="cursor: pointer;">
                    <i class="bi bi-share-fill"></i>
                </div>

                <div class="action-btn d-flex align-items-center justify-content-center" style="cursor: pointer;">
                    <i class="bi bi-flag"></i>
                </div>
            </div>
        </div>

        <div id="mediaPlayer" class="full-width-media py-1">
            <!-- <div class="media-item">
                <video controls class="w-100 h-auto">
                    <source src="" type="video/mp4">
                    Seu navegador não suporta vídeos.
                </video>
            </div>

            <div class="media-item">
                <video controls class="w-100 h-auto">
                    <source src="" type="video/mp4">
                    Seu navegador não suporta vídeos.
                </video>
            </div> -->

            <template v-for="media in post?.media" :key="media?.id">

                <div class="media-item ">
                    <video v-if="media.media_type === 'video'" :src="media.file_path" controls="true"
                        class="w-100 h-auto" />
                    <img v-else-if="media.media_type === 'image'" :src="media.file_path" class="w-100"
                        alt="Post image" />
                </div>

            </template>

        </div>

        <div id="tags" class="d-flex flex-wrap list-unstyledm pb-1">

            <template v-for="tag in post?.tag" :key="tag.id">

                <span class="d-inline-block me-1" style="max-width: 70vw;"> #{{ tag.name }} </span>

            </template>

        </div>


        <div id="commentsSection" class="mb-4">

            <div class="d-flex align-items-center text-secondary mb-2">
                <i class="bi bi-chat-fill me-2"></i>
                <span class="fs-4">Comment</span>
            </div>

            <template v-for="comment in post?.comment" :key="comment?.id">
                <div v-if="comment" class="mb-2 text-start fs-6">
                    <router-link
                        v-if="comment.user?.name"
                        :to="`/profile/${comment.user.name}`"
                        class="text-pink me-2 small text-decoration-none fw-semibold comment-user-link"
                    >
                        {{ comment.user.name }}
                    </router-link>
                    <span v-else class="text-pink me-2 small">Unknown</span>
                    <span class="text-secondary small" style="word-break: break-word;">{{ comment.content }}</span>
                </div>
            </template>

            <div class="position-relative comment-input-wrapper">
                <input
                    type="text"
                    v-model="inputComment"
                    @focus="isButtonVisible = true"
                    :disabled="status === 'loading'"
                    class="form-control bg-transparent border-secondary text-white pe-5"
                    placeholder="Add a comment"
                    @keyup.enter="addComment">

                <button
                    v-show="isButtonVisible"
                    class="send-btn position-absolute"
                    :class="{ 'loading': status === 'loading' }"
                    type="button"
                    @click="addComment"
                    :disabled="status === 'loading'">

                    <!-- spinner -->
                    <span v-if="status === 'loading'"
                          class="d-inline-flex align-items-center gap-1">
                        <div class="spinner-border spinner-border-sm text-pink"
                             style="width: 0.9rem; height: 0.9rem;" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </span>

                    <!-- icon send -->
                    <i v-else class="bi bi-send-fill text-pink"></i>
                </button>
            </div>

        </div>

        <div id="relatedPosts" class="">
            <div class="d-flex align-items-center text-secondary mb-3">
                <i class="bi bi-plus-circle-fill me-2"></i>
                <h5 class="m-0">More posts</h5>
            </div>

            <div class="row g-2">
                <div class="col-6 col-md-3">
                    <div class="card bg-dark text-white border-0 h-100">
                        <div class="ratio ratio-1x1 bg-secondary rounded overflow-hidden position-relative">
                            <img src="https://via.placeholder.com/300" class="img-fluid object-fit-cover" alt="Thumb">
                            <div
                                class="position-absolute bottom-0 start-0 w-100 p-1 d-flex justify-content-between small bg-gradient-overlay">
                                <span><i class="bi bi-eye"></i> 6.4K</span>
                                <span><i class="bi bi-camera"></i> 1</span>
                            </div>
                        </div>
                        <div class="card-body p-1">
                            <p class="card-text text-truncate small text-secondary">Screenshot_2025...</p>
                        </div>
                    </div>
                </div>

                <div class="col-6 col-md-3">
                    <div class="card bg-dark text-white border-0 h-100">
                        <div class="ratio ratio-1x1 bg-secondary rounded overflow-hidden position-relative">
                            <img src="https://via.placeholder.com/300" class="img-fluid object-fit-cover" alt="Thumb">
                            <div
                                class="position-absolute bottom-0 start-0 w-100 p-1 d-flex justify-content-between small bg-gradient-overlay">
                                <span><i class="bi bi-eye"></i> 3.9K</span>
                                <span><i class="bi bi-camera"></i> 3</span>
                            </div>
                        </div>
                        <div class="card-body p-1">
                            <p class="card-text text-truncate small text-secondary">Cumming on Blaz...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </main>
</template>

<script setup lang="ts">

import { storeToRefs } from 'pinia'
import { usePostDetailStore } from '../store/postDetail.store'
import { useAuthStore } from '../../auth/store/auth.store'
import { useProfileStore } from '../../profile/store/profile.store'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '../../../core/components/NavBar.vue'
import UserAvatar from '../../../core/components/UserAvatar.vue'
import { formatCompactNumber } from '../../../core/utils/formatters'


const postDetailStore = usePostDetailStore()
const authStore = useAuthStore()
const profileStore = useProfileStore()
const { post, status } = storeToRefs(postDetailStore)
const route = useRoute()
const router = useRouter()

const inputComment = ref('')
const isButtonVisible = ref(false)

onMounted(() => {
    postDetailStore.fetchPost(route.params.id as string)


    // aparentemente tudo tipado, por hora so preencher/ linkar os dados com a view
})

const addComment = async () => {
    if (!inputComment.value.trim()) return
    if (!post.value) return

    if (!authStore.isAuthenticated || !authStore.user?.id) {
        alert('Você precisa estar logado para comentar')
        return
    }

    const success = await postDetailStore.addComment(route.params.id, inputComment.value);

    if(success) {
        inputComment.value = ''
        isButtonVisible.value = false
    }
}

const handleLike = () => {
    if (!authStore.isAuthenticated) {
        alert('Você precisa estar logado para curtir um post')
        return
    }
    postDetailStore.toggleLike()
}

const handleFollow = () => {
    if (!authStore.isAuthenticated) {
        router.push('/')
        return
    }
    profileStore.toggleFollow()
}

// Ao carregar o post, carrega o perfil do criador para sincronizar is_following
watch(post, async (newPost) => {
    if (newPost?.user?.name) {
        await profileStore.fetchProfile(newPost.user.name)
    }
}, { immediate: true })
</script>

<style scoped>
.send-btn {
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 10;
  transition: var(--transition-normal);  /* ✅ Usando variável global */
}

.send-btn.loading {
  opacity: var(--opacity-loading);  /* ✅ Usando variável global */
  cursor: not-allowed;
}

.send-btn:not(:disabled):hover {
  transform: translateY(-50%) scale(1.1);
}

.send-btn:focus {
  outline: none;
}

input:disabled {
  opacity: var(--opacity-disabled);  /* ✅ Usando variável global */
}

/* ❌ REMOVER ESSAS LINHAS (agora estão no global.css) */
/* :root {
    --theme-bg: #1a1a1a;
    --theme-pink: #ff4d79;
    --theme-pink-hover: #e03565;
    --text-muted: #a0a0a0;
} */

.main-content {
  background-color: var(--bg-input);  /* ✅ Usando variável global */
  min-height: 100vh;
  color: var(--text-primary);  /* ✅ Usando variável global */
}

.username {
  color: var(--primary-color);  /* ✅ Roxo agora */
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  max-width: 150px;
}

.username:hover {
  color: var(--primary-light);  /* ✅ Usando variável global */
}

.text-pink {
  color: var(--primary-color);  /* ✅ Agora é roxo */
}

.avatar-circle {
  width: 35px;
  height: 35px;
  background-color: var(--bg-card);  /* ✅ Usando variável global */
  border-radius: var(--radius-full);  /* ✅ Usando variável global */
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);  /* ✅ Usando variável global */
  font-weight: bold;
}

.btn-pink {
  background-color: var(--primary-color);  /* ✅ Roxo */
  border: none;
  border-radius: var(--radius-sm);  /* ✅ Usando variável global */
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  transition: var(--transition-normal);  /* ✅ Usando variável global */
}

.btn-pink:hover {
  background-color: var(--primary-hover);  /* ✅ Usando variável global */
}

.btn-following-sm {
  background-color: transparent;
  border: 1.5px solid var(--text-muted, #a0a0a0);
  color: var(--text-muted, #a0a0a0);
}

.btn-following-sm:hover:not(:disabled) {
  border-color: #ff4d6d;
  color: #ff4d6d;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  min-width: 32px;
  padding: 0 8px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  color: var(--text-muted);
  user-select: none;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.action-btn i {
  font-size: 0.9rem;
}

.action-btn.is-active {
  color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
}

.text-danger {
  color: #ff4d6d !important;
}

.comment-user-link:hover {
  text-decoration: underline !important;
  filter: brightness(1.2);
}

.comment-input-wrapper input {
  border: 1px dashed var(--border-color);  /* ✅ Usando variável global */
  border-radius: var(--radius-sm);  /* ✅ Usando variável global */
  font-size: 0.9rem;
}

.comment-input-wrapper input::placeholder {
  color: var(--text-muted);  /* ✅ Usando variável global */
  opacity: 1;
}

.comment-input-wrapper input:focus {
  background-color: var(--bg-card) !important;  /* ✅ Usando variável global */
  border-color: var(--primary-color);  /* ✅ Usando variável global */
  box-shadow: 0 0 0 0.2rem rgba(168, 85, 247, 0.15);
  color: var(--text-white);  /* ✅ Usando variável global */
}

.bg-gradient-overlay {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
}

.full-width-media {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  padding: 0;
  margin-bottom: 1.5rem;
}

.media-item {
  width: 100%;
  margin-bottom: 1rem;
  background: #000;
}

.media-item:last-child {
  margin-bottom: 0;
}

.media-item video {
  display: block;
  max-height: 80vh;
  background: #000;
}
</style>
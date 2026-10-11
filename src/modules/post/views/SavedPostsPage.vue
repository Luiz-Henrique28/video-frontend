<template>
    <NavBar />

    <div id="swipes" class="main-content">
        <div class="p-2 d-flex align-items-center gap-2">
            <i class="bi bi-bookmark-fill fs-3 text-secondary"></i>
            <span class="fs-3 fw-bold">Saved</span>
        </div>

        <div id="tabs" class="p-2 d-flex gap-4 fs-5">
            <div class="tab-active" style="cursor: pointer;">
                ALL
            </div>
        </div>

        <div v-if="status === 'success'">
            <div v-if="posts.length === 0" class="empty-state text-center py-5 my-4">
                <i class="bi bi-bookmark-x text-secondary" style="font-size: 3rem;"></i>
                <h4 class="mt-3 text-secondary">Empty</h4>
                <p class="text-muted small">You haven't saved any posts yet.</p>
            </div>

            <div v-else class="row g-3 post-list">
                <template v-for="(post, i) in posts" :key="post.id || i">
                    <div class="col-6 col-sm-4 col-md-3 col-lg-2 mb-4">
                        <PostCard
                            class="list-unstyled"
                            :id="post.id.toString()"
                            :userId="post.user_id || 0"
                            :thumbnail_path="post.thumbnail_path"
                            :caption="post.caption"
                            :imageCount="post.image_count"
                            :videoCount="post.video_count"
                            :viewsCount="post.views_count"
                            :first_media="post.first_media"
                            :user="post.user"
                        />
                    </div>

                    <div
                        class="col-12 text-center my-2"
                        v-if="(i + 1) % 16 === 0"
                        :ref="(el) => { if (el) sentinelElement = el }"
                    ></div>
                </template>
            </div>
        </div>

        <div v-else-if="status === 'loading'" class="text-center py-5">
            <div class="spinner-border text-secondary" role="status"></div>
            <p class="mt-2 text-secondary">carregando...</p>
        </div>

        <div v-else-if="status === 'error'" class="text-center py-5 text-danger">
            <p>Erro ao carregar os posts salvos.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import NavBar from '../../../core/components/NavBar.vue';
import PostCard from '../../home/components/PostCard.vue';
import { useSavedPostStore } from '../store/savedPost.store';

const savedPostStore = useSavedPostStore();
const { posts, status, nextPage } = storeToRefs(savedPostStore);

const sentinelElement = ref<any | null>(null);
let observer: IntersectionObserver | null = null;

onMounted(() => {
    savedPostStore.listSavedPosts();
});

watch(sentinelElement, (target) => {
    if (observer) observer.disconnect();
    if (!target) return;

    observer = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
            savedPostStore.getNextPage();
        }
    }, { threshold: 0, rootMargin: '0px 0px 300px 0px' });

    if (target) {
        observer.observe(target);
    }
});

watch(() => nextPage.value, (newNextPage) => {
    if (!newNextPage && observer) {
        observer.disconnect();
    }
});

onUnmounted(() => {
    if (observer) {
        observer.disconnect();
    }
});
</script>

<style scoped>
.tab-active {
    color: var(--primary-color, #ff69b4);
    font-weight: 600;
}
</style>

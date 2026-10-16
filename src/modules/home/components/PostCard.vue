<template>
  <div :id="id">
    <!-- Thumbnail quadrada -->
    <div class="post-thumbnail-container position-relative w-100">
      <router-link :to="'/post/' + id" class="d-block">
        <div class="thumbnail-wrapper position-relative bg-dark bg-opacity-10 rounded">
          <!-- Thumbnail quando pronta e carregada com sucesso -->
          <img
            v-if="thumbnail_path && !imageError"
            :src="thumbnail_path"
            :alt="caption"
            class="w-100 h-100 object-cover rounded"
            loading="lazy"
            @error="imageError = true"
          />

          <!-- Placeholder visual quando a thumbnail ainda não existe ou se falhar o carregamento -->
          <div
            v-else
            class="thumbnail-placeholder position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center rounded bg-secondary bg-opacity-25 text-secondary"
          >
            <i :class="videoCount > 0 ? 'bi bi-camera-video-fill' : 'bi bi-image-fill'" class="fs-2 opacity-50"></i>
            <span v-if="videoCount > 0 && !thumbnail_path" class="placeholder-text small mt-1 opacity-75 fw-medium text-center px-2">
              Gerando prévia...
            </span>
          </div>

          <div class="post-views position-absolute bottom-0 start-0 p-2 d-flex align-items-center">
            <div class="d-flex align-items-center bg-dark bg-opacity-75 text-white px-2 py-1 rounded-pill small">
              <i class="bi bi-eye-fill me-1"></i>
              <span>{{ formatCompactNumber(viewsCount) }}</span>
            </div>
          </div>

          <div class="post-counts position-absolute bottom-0 end-0 p-2 d-flex align-items-center">
            <div
              v-if="imageCount > 0"
              class="d-flex align-items-center me-2 bg-dark bg-opacity-75 text-white px-2 py-1 rounded-pill small"
            >
              <i class="bi bi-camera-fill me-1"></i>
              <span>{{ imageCount }}</span>
            </div>

            <div
              v-if="videoCount > 0"
              class="d-flex align-items-center bg-dark bg-opacity-75 text-white px-2 py-1 rounded-pill small"
            >
              <i class="bi bi-camera-video-fill me-1"></i>
              <span>{{ videoCount }}</span>
            </div>
          </div>
        </div>
      </router-link>
    </div>

    <!-- Informações do usuário (ou indicador de repost) -->
    <div class="mt-2">
      <router-link :to="'/post/' + id" class="d-block fw-semibold w-100 post-caption post-caption-lines" :title="caption">
        {{ caption }}
      </router-link>
      <div v-if="isRepost" class="d-flex align-items-center mt-1">
        <i class="bi bi-arrow-repeat text-secondary me-1 fs-6 flex-shrink-0" title="Republicação"></i>
        <router-link
          v-if="user?.name"
          :to="'/profile/' + user.name"
          class="text-start text-truncate post-username post-username-size text-decoration-none"
        >{{ user?.name }}</router-link>
      </div>
      <div v-else-if="!hideUser" class="d-flex align-items-center mt-1">
        <UserAvatar :name="user?.name" :avatarUrl="user?.avatar" :to="user?.name ? `/profile/${user.name}` : null" :size="24" class="me-1" />
        <router-link
          v-if="user?.name"
          :to="'/profile/' + user.name"
          class="text-start text-truncate post-username post-username-size text-decoration-none"
        >{{ user?.name }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, type PropType } from 'vue';
import UserAvatar from '../../../core/components/UserAvatar.vue';
import { formatCompactNumber } from '../../../core/utils/formatters';

const props = defineProps({
  id: { type: String, required: true },
  userId: { type: Number, default: 0 },
  caption: { type: String, default: '' },
  thumbnail_path: { type: String as PropType<string | null>, default: null },
  user: { type: Object, required: true },
  imageCount: { type: Number, default: 0 },
  videoCount: { type: Number, default: 0 },
  viewsCount: { type: Number, default: 0 },
  hideUser: { type: Boolean, default: false },
  isRepost: { type: Boolean, default: false },
});

const imageError = ref(false);

watch(
  () => props.thumbnail_path,
  (newVal) => {
    if (newVal) {
      imageError.value = false;
    }
  }
);
</script>

<style scoped>
.post-thumbnail-container .thumbnail-wrapper {
  width: 100%;
  padding-top: 100%;
  /* cria proporção quadrada */
  position: relative;
  overflow: hidden;
}

.post-thumbnail-container img {
  position: absolute;
  top: 0;
  left: 0;
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.thumbnail-placeholder {
  user-select: none;
  transition: opacity 0.2s ease-in-out;
}

.placeholder-text {
  font-size: 0.72rem;
  letter-spacing: -0.2px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  min-width: 36px;
  min-height: 36px;
  object-fit: cover;
}

.flex-column {
  min-width: 0;
}

.post-caption-lines {
  display: -webkit-box !important;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  word-break: break-word;
  text-overflow: clip;
  max-height: 2.8em;
  line-height: 1.4em;
}

.post-username-size {
  font-size: 0.85rem;
}

.post-user {
  font-size: 0.75rem;
}
</style>

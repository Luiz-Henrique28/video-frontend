<template>
  <div :id="id">
    <!-- Thumbnail quadrada -->
    <div class="post-thumbnail-container position-relative w-100">
        <a :href="'/post/' + id" class="d-block">

        <div class="thumbnail-wrapper position-relative">
          <img :src="thumbnail_path" :alt="caption" class="w-100 h-100 object-cover rounded" loading="lazy" />

          <div class="post-counts position-absolute bottom-0 end-0 p-2 d-flex align-items-center">

            <div v-if="imageCount > 0"
              class="d-flex align-items-center me-2 bg-dark bg-opacity-75 text-white px-2 py-1 rounded-pill small">
              <i class="bi bi-camera-fill me-1"></i>
              <span>{{ imageCount }}</span>
            </div>

            <div v-if="videoCount > 0"
              class="d-flex align-items-center bg-dark bg-opacity-75 text-white px-2 py-1 rounded-pill small">
              <i class="bi bi-camera-video-fill me-1"></i>
              <span>{{ videoCount }}</span>
            </div>

          </div>

        </div>
      </a>
    </div>

    <!-- Informações do usuário -->
    <div class="d-flex align-items-start mt-2 col-12">
      <img :src="user.avatar" :alt="user.name + ' avatar'" class="user-avatar rounded-circle me-2 flex-shrink-0" />
      <div class="flex-column">
        <a :href="'/post/' + id" class="d-block fw-semibold w-100 post-caption post-caption-lines" :title="caption">
          {{ caption }}
        </a>
        <span class="text-start d-block text-truncate post-username post-username-size">{{ user.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {  } from 'vue';

const props = defineProps({
  id: { type: String, required: true },
  userId: { type: Number, required: true },
  caption: { type: String, default: '' },
  thumbnail_path: { type: String, default: null },
  user: { type: Object, required: true },
  imageCount: { type: Number, default: 0 },
  videoCount: { type: Number, default: 0 }
});
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

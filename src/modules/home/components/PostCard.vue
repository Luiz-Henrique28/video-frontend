<template>
  <div class="col-6 col-sm-4 col-md-3 col-lg-2 mb-4" :id="'post-' + id">
    <!-- Thumbnail quadrada -->
    <div class="post-thumbnail-container position-relative w-100">
      <a :href="'/posts/' + id" class="d-block">
        <div class="thumbnail-wrapper">
          <img :src="firstMedia?.file_path" :alt="caption" class="w-100 h-100 object-cover rounded" loading="lazy" />
        </div>
      </a>
    </div>

    <!-- Informações do usuário -->
    <div class="d-flex align-items-center mt-2 col-12">
      <img :src="user.avatar" :alt="user.name + ' avatar'" class="rounded-circle me-1 align-center" width="36" height="36" />
      <div class="flex-column">
        <a :href="'/posts/' + id" class="d-block fw-semibold text-truncate w-100" :title="caption">
          {{ caption }}
        </a>
        <span class="text-start d-block text-truncate">{{ user.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  id: { type: Number, required: true },
  userId: { type: Number, required: true },
  caption: { type: String, default: '' },
  firstMedia: { type: Object, default: null },
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


.flex-column {
  min-width: 0;
}


.post-user {
  font-size: 0.75rem;
}
</style>

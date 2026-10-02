<template>
  <component
    :is="to ? 'router-link' : 'div'"
    :to="to"
    class="user-avatar-container"
    :class="[customClass, { 'is-clickable': !!to }]"
    :style="sizeStyle"
  >
    <img
      v-if="avatarUrl && !imageError"
      :src="avatarUrl"
      :alt="name || 'User Avatar'"
      class="avatar-img"
      @error="imageError = true"
    />
    <div v-else class="avatar-fallback" :style="fontSizeStyle">
      <span>{{ initialLetter }}</span>
    </div>
  </component>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    name?: string | null;
    avatarUrl?: string | null;
    size?: number | string;
    customClass?: string;
    to?: string | object | null;
  }>(),
  {
    name: '',
    avatarUrl: null,
    size: 40,
    customClass: '',
    to: null,
  }
);

const imageError = ref(false);

// Reseta o estado de erro caso o avatarUrl mude (ex: ao navegar entre perfis)
watch(
  () => props.avatarUrl,
  () => {
    imageError.value = false;
  }
);

const initialLetter = computed(() => {
  return props.name && props.name.trim() ? props.name.trim().charAt(0).toUpperCase() : 'U';
});

const sizeStyle = computed(() => {
  const s = typeof props.size === 'number' ? `${props.size}px` : props.size;
  return {
    width: s,
    height: s,
    minWidth: s,
    minHeight: s,
  };
});

const fontSizeStyle = computed(() => {
  const numSize = typeof props.size === 'number' ? props.size : parseInt(props.size, 10);
  if (!isNaN(numSize)) {
    return { fontSize: `${Math.max(12, Math.round(numSize * 0.45))}px` };
  }
  return {};
});
</script>

<style scoped>
.user-avatar-container {
  border-radius: 50%;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-card, #2a2a2a);
  user-select: none;
  flex-shrink: 0;
  text-decoration: none;
}

.is-clickable {
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.is-clickable:hover {
  opacity: 0.85;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.avatar-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--text-primary, #fff);
  background-color: var(--bg-card, #2a2a2a);
  text-transform: uppercase;
}
</style>

<script setup lang="ts">
import { watch } from 'vue';
import { useAuthStore } from './modules/auth/store/auth.store';
const authStore = useAuthStore();
// import CreatePostPage from './modules/post/views/CreatePostPage.vue';

watch(
  () => authStore.token,
  (newToken) => {
    if (newToken && !authStore.user) {
      // Chama o endpoint /me em background (sem travar a tela)
      authStore.fetchUser();
    }
  },
  { immediate: true } // Roda assim que o App monta
);
</script>



<template>
  <div id="app-layout">
    <router-view></router-view>
  </div>

</template>



<style scoped>
.splash-screen {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

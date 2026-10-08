<template>
  <NavBar />
  <main class="not-found-container d-flex flex-column align-items-center justify-content-center text-center px-3">
    <div class="error-code">404</div>
    <h1 class="error-title mb-2">Página não encontrada</h1>
    <p class="error-description mb-4">
      O link que você tentou acessar não existe ou foi removido.
    </p>
    <router-link to="/home" class="btn btn-primary-custom px-4 py-2">
      <i class="bi bi-house-door-fill me-2"></i>Voltar para o início
    </router-link>
  </main>
</template>

<script setup lang="ts">
import NavBar from '../components/NavBar.vue';
</script>

<style scoped>
.not-found-container {
  min-height: calc(100vh - 70px);
  color: var(--text-primary);
}

.error-code {
  font-size: 6rem;
  font-weight: 800;
  line-height: 1;
  color: var(--primary-color);
  letter-spacing: -2px;
}

.error-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-white);
}

.error-description {
  max-width: 420px;
  color: var(--text-secondary);
  font-size: 1rem;
}

.btn-primary-custom {
  background-color: var(--primary-color);
  color: var(--text-white);
  border: none;
  border-radius: var(--radius-md, 8px);
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition-normal, all 0.2s ease);
  display: inline-flex;
  align-items: center;
}

.btn-primary-custom:hover {
  background-color: var(--primary-hover);
  color: var(--text-white);
  transform: translateY(-2px);
}
</style>

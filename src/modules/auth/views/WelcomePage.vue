<script setup lang="ts">

import { useAuthStore } from '../store/auth.store';

const authStore = useAuthStore();
const status = authStore.status

</script>

<template>


  <div class="welcome-wrapper">
    <div class="bg-image"></div>
    <div class="bg-overlay"></div>

    <!-- load spinner -->
    <div v-if="status === 'loading'"
      class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-25"
      style="z-index: 9999;">

      <div class="spinner-border text-pink" style="width: 3rem; height: 3rem; color: var(--primary-color);" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>

    </div>

    <div v-else class="content-layer container d-flex flex-column justify-content-center align-items-center vh-100">

      <!-- Logo -->
      <div class="text-center mb-4">
        <h1 class="logo-text">Nome<span class="text-primary-custom"> da plataforma</span></h1>
        <p class="subtitle">Photo & Video Sharing</p>
      </div>



      <!-- Botões de Login -->
      <div class="d-grid gap-2 col-11 col-sm-8 col-md-6 col-lg-4">
        <button class="btn-login" @click="authStore.handleGoogleLogin">
          <i class="bi bi-google"></i>
          <span>LOGIN WITH GOOGLE</span>
        </button>

        <button class="btn-login">
          <i class="bi bi-reddit"></i>
          <span>LOGIN WITH REDDIT</span>
        </button>

        <button class="btn-login">
          <i class="bi bi-twitter-x"></i>
          <span>LOGIN WITH TWITTER</span>
        </button>

        <button class="btn-login">
          <i class="bi bi-envelope-fill"></i>
          <span>LOGIN WITH EMAIL</span>
        </button>
      </div>

      <!-- Link Explore -->
      <div class="mt-4">
        <router-link to="/home" class="explore-link">Explore</router-link>
      </div>

      <!-- Footer -->
      <footer class="footer-links">
        <ul class="list-inline m-0 text-center">
          <li class="list-inline-item"><a href="#">Language</a></li>
          <li class="list-inline-item">-</li>
          <li class="list-inline-item"><a href="#">FAQ</a></li>
          <li class="list-inline-item">-</li>
          <li class="list-inline-item"><a href="#">Terms</a></li>
          <li class="list-inline-item">-</li>
          <li class="list-inline-item"><a href="#">DMCA/Abuse</a></li>
          <li class="list-inline-item">-</li>
          <li class="list-inline-item"><a href="#">Feedback</a></li>
        </ul>
      </footer>

    </div>
  </div>
</template>

<style scoped>
/* ========================================
   LAYOUT & ESTRUTURA
   ======================================== */
.welcome-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: var(--bg-dark);
  overflow: hidden;
}

.bg-image {
  position: absolute;
  inset: 0;
  background-image: url('https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=2459&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  z-index: 1;
}

.bg-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(20, 20, 20, 0.85) 0%, rgba(10, 10, 10, 0.95) 70%, rgba(0, 0, 0, 1) 100%);
  z-index: 2;
}

.content-layer {
  position: relative;
  z-index: 3;
}

/* ========================================
   TIPOGRAFIA
   ======================================== */
.logo-text {
  font-weight: 700;
  font-size: 3rem;
  color: var(--text-white);
  margin-bottom: 0;
}

.subtitle {
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
  opacity: 0.8;
}

/* ========================================
   BOTÕES
   ======================================== */
.btn-login {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: var(--primary-color);
  border: none;
  border-radius: var(--radius-sm);
  color: var(--bg-dark);
  font-weight: 600;
  font-size: 0.8rem;
  padding: 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: var(--transition-normal);
}

.btn-login:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-login i {
  font-size: 1.1rem;
}

/* ========================================
   LINKS
   ======================================== */
.explore-link {
  color: var(--text-secondary);
  text-decoration: none;
  transition: var(--transition-normal);
}

.explore-link:hover {
  color: var(--text-white);
}

/* ========================================
   FOOTER
   ======================================== */
.footer-links {
  position: absolute;
  bottom: 15px;
  width: 100%;
  font-size: 0.7rem;
  color: var(--text-muted);
}

.footer-links a {
  color: var(--text-muted);
  text-decoration: none;
  transition: var(--transition-fast);
}

.footer-links a:hover {
  color: var(--text-secondary);
  text-decoration: underline;
}
</style>
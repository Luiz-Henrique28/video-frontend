<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../../modules/auth/store/auth.store';

const authStore = useAuthStore();
const menuOpen = ref(false);

const toggleMenu = () => {
    menuOpen.value = !menuOpen.value;
};
</script>

<template>
    <header class="navbar-wrapper">
    <nav class="navbar navbar-dark navbar-expand-md p-0">

        <div class="container-fluid d-flex justify-content-around align-items-center">
            <router-link to="#"> <span class="logo-icon fs-3 text-light">link 1</span> </router-link>
            <router-link to="#"> <span class="logo-icon fs-3 text-light">link 1</span> </router-link>
            <router-link to="#"> <span class="logo-icon fs-3 text-light">link 1</span> </router-link>
        </div>

        <hr class="navbar-divider w-100 my-0">

        <div class="container-fluid d-flex justify-content-between align-items-center">

            <!-- Logo -->
            <router-link to="/home" class="navbar-brand d-flex align-items-center gap-1">
                <span class="logo-icon">&#9829;</span>
                
                <!-- nome da plataforma -->
                <span class="logo-text">Unname</span>
            </router-link>

            <!-- Links centrais (hidden no mobile) -->
            <div class="d-flex align-items-center gap-4">

                <router-link to="#" class="nav-link d-flex gap-1">
                    <i class="bi bi-gender-male"></i>
                    <i class="bi bi-gender-female"></i>
                </router-link>

                <router-link to="#" class="nav-link live-link d-flex align-items-center gap-2">
                    LIVE<span class="live-dot"></span>
                </router-link>

            </div>

            <!-- Ações direita -->
            <div class="d-flex align-items-center gap-3">

                <!-- Search -->
                <!-- <button class="btn btn-link nav-link d-flex align-items-center gap-2 p-0">
          <i class="bi bi-search"></i>
          <span class="d-none d-md-inline">SEARCH</span>
        </button> -->

                <!-- Sign In (não logado) -->
                <!-- User menu (logado) -->
                <!-- <router-link v-if="!authStore.user" to="/" class="btn btn-link nav-link d-flex align-items-center gap-2 p-0">
          <i class="bi bi-person-fill"></i>
          <span class="d-none d-md-inline">SIGN IN</span>
        </router-link>


        <div v-else class="d-flex align-items-center gap-2">
          <img :src="authStore.user.avatar" alt="Avatar" class="user-avatar rounded-circle" />
          <button @click="authStore.logout" class="btn btn-link nav-link p-0">
            <i class="bi bi-box-arrow-right"></i>
          </button>
        </div> -->

                <!-- Menu hamburguer (mobile) -->
                <button class="btn btn-primary d-md-none menu-btn" @click="toggleMenu">
                    <i class="bi" :class="menuOpen ? 'bi-x-lg' : 'bi-list'"></i>
                </button>
            </div>

        </div>

        <hr class="navbar-divider w-100 my-0">
        
    </nav>

    <!-- Menu mobile expandido (overlay) -->
    <div class="mobile-menu d-md-none collapse" :class="{ show: menuOpen }">
        <div v-if="!authStore.isAuthenticate" class="d-flex flex-column gap-3 px-3 py-3">

            <router-link to="#" class="nav-link" @click="menuOpen = false">
                <i class="bi bi-search me-2"></i>SEARCH
            </router-link>

            <router-link to="/post/create" class="nav-link" @click="menuOpen = false">
                <i class="bi bi-box-arrow-in-right me-2"></i>SIGN IN
            </router-link>

        </div>

        <div v-else class="d-flex flex-column gap-3 px-3 py-3">

            <router-link to="#" class="nav-link" @click="menuOpen = false">
                <i class="bi bi-search me-2"></i>SEARCH
            </router-link>

            <router-link to="/home" class="nav-link" @click="menuOpen = false">
                <i class="bi bi-rss me-2"></i>FEED
            </router-link>

            <router-link to="#" class="nav-link" @click="menuOpen = false">
                <i class="bi bi-heart-fill me-2"></i>LIKED
            </router-link>

            <router-link to="#" class="nav-link" @click="menuOpen = false">
                <i class="bi bi-bookmark-fill me-2"></i>SAVED
            </router-link>

            <router-link to="#" class="nav-link" @click="menuOpen = false">
                <i class="bi bi-chat-dots-fill me-2"></i>MESSAGES
            </router-link>

            <router-link to="#" class="nav-link" @click="menuOpen = false">
                <i class="bi bi-bell-fill me-2"></i>NOTIFICATIONS
            </router-link>

            <router-link to="/post/create" class="nav-link" @click="menuOpen = false">
                <i class="bi bi-upload me-2"></i>UPLOAD
            </router-link>

            <router-link to="#" class="nav-link" @click="menuOpen = false">
                <i class="bi bi-gear-fill me-2"></i>SETTINGS
            </router-link>

            <router-link to="#" class="nav-link" @click="menuOpen = false">
                <i class="bi bi-person-fill me-2"></i>PROFILE
            </router-link>

        </div>
    </div>
    </header>
</template>

<style scoped>
.navbar-wrapper {
    position: sticky;
    top: 0;
    z-index: 1000;
}

.navbar {
    background-color: var(--bg-dark, #1a1a1a);
}

.navbar-divider {
    border: none;
    border-top: 1px solid var(--text-muted, #333);
    opacity: 0.5;
}

/* Logo */
.logo-icon {
    color: var(--primary-color, #ff69b4);
    font-size: 1.5rem;
}

.logo-text {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--text-white, #fff);
}

.logo-highlight {
    color: var(--primary-color, #ff69b4);
}

/* Links */
.nav-link {
    color: var(--text-secondary, #aaa) !important;
    font-size: 1rem;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.2s;
}

.nav-link i {
    font-size: 1.1rem;
}

.nav-link:hover {
    color: var(--text-white, #fff) !important;
}

.live-link {
    color: #4ade80 !important;
}

.live-dot {
    width: 8px;
    height: 8px;
    background-color: #4ade80;
    border-radius: 50%;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

/* User avatar */
.user-avatar {
    width: 32px;
    height: 32px;
    object-fit: cover;
}

/* Menu button */
.menu-btn {
    background-color: var(--primary-color, #ff69b4) !important;
    border: none;
    padding: 0.4rem 0.6rem;
}

/* Mobile menu */
.mobile-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: var(--bg-dark, #1a1a1a);
    border-top: 1px solid var(--text-muted, #444);
    z-index: 999;
}
</style>

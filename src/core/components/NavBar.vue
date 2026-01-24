<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../modules/auth/store/auth.store';
import { useDebounceFn } from '@vueuse/core';
import { http } from '../services/http';

// --- Interfaces ---
interface SearchResult {
    id: number | string;
    label: string;
    type: 'user' | 'tag' | 'post' | 'search';
    image?: string | null;
}

// --- Setup ---
const router = useRouter();
const authStore = useAuthStore();

// --- Estados ---
const menuOpen = ref(false);
const searchFieldIsOpen = ref(false);
const searchQuery = ref('');
const searchInputRef = ref<HTMLInputElement | null>(null);
const isLoading = ref(false);
const searchResult = ref<SearchResult[]>([]);

// --- Lógica de Busca ---
const performSearch = useDebounceFn(async (query: string) => {
    if (query.length < 2) {
        searchResult.value = [];
        return;
    }

    isLoading.value = true;
    try {
        const response = await http.get(`/search?q=${query}`);
        searchResult.value = response.data;
    } catch (error) {
        console.error("Erro na busca", error);
        searchResult.value = [];
    } finally {
        isLoading.value = false;
    }
}, 500);

watch(searchQuery, (newQuery) => performSearch(newQuery));

// --- Ações ---
const toggleSearchField = () => {
    searchFieldIsOpen.value = !searchFieldIsOpen.value;
    if (searchFieldIsOpen.value) {
        nextTick(() => searchInputRef.value?.focus());
    } else {
        closeSearchField();
    }
}

const closeSearchField = () => {
    searchFieldIsOpen.value = false;
    searchQuery.value = '';
    searchResult.value = [];
}

const toggleMenu = () => {
    menuOpen.value = !menuOpen.value;
}

const submitFullSearch = () => {
    closeSearchField();
    router.push({ path: '/search', query: { q: searchQuery.value } });
};

const goToResult = (item: SearchResult) => {
    closeSearchField();
    if (item.type === 'user') {
        router.push(`/profile/${item.label}`);
    } else if (item.type === 'tag') {
        router.push(`/tag/${item.label.replace('#', '')}`);
    } else {
        router.push({ path: '/search', query: { q: item.label } });
    }
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

                <router-link to="/home" class="navbar-brand d-flex align-items-center gap-1">
                    <span class="logo-icon">&#9829;</span>
                    <span class="logo-text">Unname</span>
                </router-link>

                <div class="d-flex align-items-center gap-4">
                    <router-link to="#" class="nav-link d-flex gap-1">
                        <i class="bi bi-gender-male"></i>
                        <i class="bi bi-gender-female"></i>
                    </router-link>

                    <router-link to="#" class="nav-link live-link d-flex align-items-center gap-2">
                        LIVE<span class="live-dot"></span>
                    </router-link>
                </div>

                <div class="d-flex align-items-center gap-3">

                    <button class="btn btn-primary d-md-none menu-btn" @click="toggleMenu">
                        <i class="bi" :class="menuOpen ? 'bi-x-lg' : 'bi-list'"></i>
                    </button>
                </div>

            </div>

            <hr class="navbar-divider w-100 my-0">

        </nav>

        <div v-if="searchFieldIsOpen" class="search-overlay">
            <div class="search-container">
                <button class="btn-close-search" @click="closeSearchField">
                    <i class="bi bi-x-lg"></i>
                </button>

                <form @submit.prevent="submitFullSearch" class="search-input-wrapper">
                    <i class="bi bi-search search-icon"></i>
                    <input 
                        ref="searchInputRef"
                        v-model="searchQuery" 
                        type="search" 
                        class="form-control search-input" 
                        placeholder="Search users, tags..." 
                        autofocus 
                    />
                    <div v-if="isLoading" class="spinner-border spinner-border-sm text-secondary position-absolute end-0 top-50 translate-middle me-3" role="status"></div>
                </form>

                <div v-if="searchResult.length > 0" class="search-results-box mt-2 bg-dark rounded border border-secondary">
                    <div 
                        v-for="(item, index) in searchResult" 
                        :key="index"
                        class="d-flex align-items-center p-2 border-bottom border-secondary cursor-pointer hover-bg"
                        @click="goToResult(item)"
                        style="cursor: pointer;"
                    >
                        <div v-if="item.type === 'user'" class="d-flex align-items-center w-100 text-white">
                            <img :src="item.image || '/default-user.png'" class="rounded-circle me-3" style="width: 32px; height: 32px; object-fit: cover;">
                            <span class="fw-bold">{{ item.label }}</span>
                            <span class="badge bg-secondary ms-auto">User</span>
                        </div>
                        <div v-else class="d-flex align-items-center w-100 text-white">
                            <div class="me-3 d-flex align-items-center justify-content-center bg-secondary rounded-circle" style="width: 32px; height: 32px;">
                                <i class="bi" :class="item.type === 'tag' ? 'bi-hash' : 'bi-search'"></i>
                            </div>
                            <span>{{ item.label }}</span>
                        </div>
                    </div>
                </div>

                <div v-else-if="searchQuery.length > 2 && !isLoading" class="text-center mt-3 text-muted">
                    No results found.
                </div>

            </div>
        </div>

        <div class="mobile-menu d-md-none collapse" :class="{ show: menuOpen }">
             <div v-if="!authStore.isAuthenticate" class="d-flex flex-column gap-3 px-3 py-3">
                <router-link to="#" class="nav-link" @click="menuOpen = false; toggleSearchField()">
                    <i class="bi bi-search me-2"></i>SEARCH
                </router-link>
                <router-link to="/" class="nav-link" @click="menuOpen = false">
                    <i class="bi bi-box-arrow-in-right me-2"></i>SIGN IN
                </router-link>
            </div>
            
            <div v-else class="d-flex flex-column gap-3 px-3 py-3">
                 <router-link to="#" class="nav-link" @click="menuOpen = false; toggleSearchField()">
                    <i class="bi bi-search me-2"></i>SEARCH
                </router-link>
                <router-link to="/home" class="nav-link" @click="menuOpen = false">
                    <i class="bi bi-rss me-2"></i>FEED
                </router-link>
                </div>
        </div>
    </header>
</template>

<style scoped>
/* Seus estilos originais mantidos */
.navbar-wrapper { position: sticky; top: 0; z-index: 1000; }
.navbar { background-color: var(--bg-dark, #1a1a1a); }
.navbar-divider { border: none; border-top: 1px solid var(--text-muted, #333); opacity: 0.5; }
.logo-icon { color: var(--primary-color, #ff69b4); font-size: 1.5rem; }
.logo-text { font-size: 1.75rem; font-weight: 700; color: var(--text-white, #fff); }
.nav-link { color: var(--text-secondary, #aaa) !important; font-size: 1rem; font-weight: 600; text-decoration: none; transition: color 0.2s; }
.nav-link:hover { color: var(--text-white, #fff) !important; }
.live-link { color: #4ade80 !important; }
.live-dot { width: 8px; height: 8px; background-color: #4ade80; border-radius: 50%; animation: pulse 1.5s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
.menu-btn { background-color: var(--primary-color, #ff69b4) !important; border: none; padding: 0.4rem 0.6rem; }
.mobile-menu { position: absolute; top: 100%; left: 0; right: 0; background-color: var(--bg-dark, #1a1a1a); border-top: 1px solid var(--text-muted, #444); z-index: 999; }

/* Overlay styles */
.search-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(26, 26, 26, 0.95);
    z-index: 1050;
    display: flex;
    flex-direction: column;
    padding: 1rem;
}

.search-container {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
}

.btn-close-search {
    margin-top: 1.4rem;
    position: absolute;
    top: 0rem;
    right: 1.5rem;
    background: none;
    border: none;
    color: var(--text-secondary, #aaa);
    font-size: 1.50rem;
    cursor: pointer;
}

.btn-close-search:hover { color: var(--text-white, #fff); }

.search-input-wrapper {
    position: relative;
    margin-top: 3rem;
}

.search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary, #aaa);
}

.search-input {
    background-color: var(--bg-card, #2a2a2a);
    border: 1px solid var(--text-muted, #444);
    border-radius: 8px;
    color: var(--text-white, #fff);
    padding: 0.75rem 1rem 0.75rem 2.75rem;
    font-size: 1rem;
    width: 100%; /* Garante largura total */
}

.search-input:focus {
    background-color: var(--bg-card, #2a2a2a);
    border-color: var(--primary-color, #ff69b4);
    box-shadow: none;
    color: var(--text-white, #fff);
    outline: none;
}

/* Novo Estilo para o hover da lista */
.hover-bg:hover {
    background-color: #333;
}
</style>
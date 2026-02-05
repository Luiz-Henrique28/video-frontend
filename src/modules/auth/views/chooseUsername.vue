<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../../auth/store/auth.store';
import { http } from '../../../core/services/http';
import router from '../../../core/router';

const authStore = useAuthStore();
const username = ref(authStore.user?.name || '');
const isSubmitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const showMessage = (message: string, isError = false) => {
    if (isError) {
        errorMessage.value = message;
        successMessage.value = '';
    } else {
        successMessage.value = message;
        errorMessage.value = '';
    }
    setTimeout(() => {
        successMessage.value = '';
        errorMessage.value = '';
    }, 3000);
};

const submitUsername = async () => {
    if (!username.value.trim()) return;
    if (username.value.trim().length < 3) {
        showMessage('Username must be at least 3 characters', true);
        return;
    }

    isSubmitting.value = true;
    try {
        await http.patch('/user/username', { name: username.value })

        if (authStore.user) authStore.user.name = username.value;

        console.log("passou aqui", authStore.user?.name)
        
        showMessage('Username saved successfully!');
        router.push('/home'), 800;

    } catch (err: any) {

        if (err.status === 422 || err.data?.type === 'validation') {
            showMessage(err.response?.data?.message, true);
            return;
        }

        showMessage(err.response?.data?.message || 'Error saving username', true);
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<template>

    <div class="choose-username-page">
        <div class="choose-username-card">
            <h1 class="title">Choose a username</h1>
            <p class="lead">This is how you'll appear to other users.</p>

            <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
            <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

            <input v-model="username" type="text" class="form-control settings-input username-input"
                placeholder="Username" @keyup.enter="submitUsername" />

            <div class="d-flex justify-content-between align-items-center mt-3">
                <small class="text-muted">Use letters, numbers and _ (min. 3 chars)</small>
                <button class="btn btn-primary" :disabled="isSubmitting || !username.trim()" @click="submitUsername">
                    <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1"></span>
                    Continue
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.choose-username-page {
    background-color: var(--bg-dark, #1a1a1a);
    min-height: 100vh;
    color: var(--text-white, #fff);
    display: flex;
    align-items: flex-start;
    /* alinhar ao topo */
    justify-content: center;
    /* Espaçamento superior para não ficar colado no NavBar (~56px) */
    padding: calc(56px + 1rem) 1rem 2rem;
}

.choose-username-card {
    width: 100%;
    max-width: 480px;
    background-color: var(--bg-card, #2a2a2a);
    border: 1px solid #333;
    padding: 2rem;
    border-radius: 8px;
    margin-top: 0;
    /* garantir que fique encostado no topo do container com espaçamento */
}

.title {
    color: var(--primary-color, #ff69b4);
    margin-bottom: 0.25rem;
    font-weight: 700;
    font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    font-size: 1.25rem;
}

.lead {
    color: var(--text-muted, #777);
    margin-bottom: 1rem;
    font-size: 0.95rem;
    font-weight: 400;
    opacity: 0.85;
    letter-spacing: 0.2px;
    font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.username-input {
    background-color: var(--bg-card, #2a2a2a);
    border: 1px solid #444;
    color: var(--text-white, #fff);
    padding: 0.6rem 0.75rem;
    font-size: 1rem;
}

.username-input:focus {
    border-color: var(--primary-color, #ff69b4);
    box-shadow: none;
}

.btn-primary {
    background-color: var(--primary-color, #ff69b4);
    border-color: var(--primary-color, #ff69b4);
}

.btn-primary:hover {
    background-color: #ff4da6;
    border-color: #ff4da6;
}
</style>
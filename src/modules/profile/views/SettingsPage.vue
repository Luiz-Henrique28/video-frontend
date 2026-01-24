<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../../auth/store/auth.store';
import { http } from '../../../core/services/http';
import NavBar from '../../../core/components/NavBar.vue';

const authStore = useAuthStore();
const user = computed(() => authStore.user);

// Form states
const username = ref('');
const bio = ref('');
const website = ref('');
const password = ref('');
const confirmPassword = ref('');

// Options
const options = ref({
    disableComments: false,
    disableDownload: false,
    doNotReceiveChat: false,
    makeAccountPrivate: false
});

// Loading states
const isUpdatingUsername = ref(false);
const isUpdatingBio = ref(false);
const isUpdatingPassword = ref(false);

// Messages
const successMessage = ref('');
const errorMessage = ref('');

const getAvatarLetter = computed(() => {
    return user.value?.name?.charAt(0).toUpperCase() || 'U';
});

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

const updateUsername = async () => {
    if (!username.value.trim()) return;

    isUpdatingUsername.value = true;
    try {
        await http.put('/user/username', { username: username.value });
        showMessage('Username updated successfully!');
        if (authStore.user) {
            authStore.user.name = username.value;
        }
    } catch (error: any) {
        showMessage(error.response?.data?.message || 'Error updating username', true);
    } finally {
        isUpdatingUsername.value = false;
    }
};

const updateBio = async () => {
    isUpdatingBio.value = true;
    try {
        await http.put('/user/bio', { bio: bio.value });
        showMessage('Bio updated successfully!');
    } catch (error: any) {
        showMessage(error.response?.data?.message || 'Error updating bio', true);
    } finally {
        isUpdatingBio.value = false;
    }
};

const updatePassword = async () => {
    if (password.value !== confirmPassword.value) {
        showMessage('Passwords do not match', true);
        return;
    }
    if (password.value.length < 6) {
        showMessage('Password must be at least 6 characters', true);
        return;
    }

    isUpdatingPassword.value = true;
    try {
        await http.put('/user/password', { password: password.value });
        showMessage('Password updated successfully!');
        password.value = '';
        confirmPassword.value = '';
    } catch (error: any) {
        showMessage(error.response?.data?.message || 'Error updating password', true);
    } finally {
        isUpdatingPassword.value = false;
    }
};

const updateOptions = async () => {
    try {
        await http.put('/user/options', options.value);
        showMessage('Options updated successfully!');
    } catch (error: any) {
        showMessage(error.response?.data?.message || 'Error updating options', true);
    }
};

const handleAvatarChange = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const formData = new FormData();
    formData.append('avatar', file);

    try {
        const response = await http.post('/user/avatar', formData);
        if (authStore.user && response.data.avatar) {
            authStore.user.avatar = response.data.avatar;
        }
        showMessage('Avatar updated successfully!');
    } catch (error: any) {
        showMessage(error.response?.data?.message || 'Error updating avatar', true);
    }
};

const handleLogout = () => {
    authStore.logout();
};

onMounted(() => {
    if (user.value) {
        username.value = user.value.name || '';
    }
});
</script>

<template>
    <NavBar />

    <div class="settings-page">
        <div class="settings-container">

            <!-- Header com Avatar -->
            <div class="text-center py-4">
                <div class="avatar-wrapper mx-auto mb-2 position-relative">
                    <img
                        v-if="user?.avatar"
                        :src="user.avatar"
                        :alt="user?.name"
                        class="avatar-img"
                    />
                    <div v-else class="avatar-placeholder">
                        {{ getAvatarLetter }}
                    </div>

                    <!-- Edit button -->
                    <label class="avatar-edit-btn">
                        <i class="bi bi-pencil-fill"></i>
                        <input
                            type="file"
                            accept="image/*"
                            class="d-none"
                            @change="handleAvatarChange"
                        />
                    </label>
                </div>

                <h2 class="username text-primary">{{ user?.name }}</h2>

                <button class="btn btn-outline-secondary btn-sm mt-2">
                    <i class="bi bi-patch-check me-1"></i> Get verified
                </button>
            </div>

            <!-- Messages -->
            <div v-if="successMessage" class="alert alert-success mx-3">
                {{ successMessage }}
            </div>
            <div v-if="errorMessage" class="alert alert-danger mx-3">
                {{ errorMessage }}
            </div>

            <!-- Username Section -->
            <div class="settings-section">
                <div class="section-header d-flex justify-content-between">
                    <label class="section-label">Username</label>
                    <button class="btn btn-link text-primary p-0" @click="handleLogout">
                        Logout
                    </button>
                </div>
                <input
                    v-model="username"
                    type="text"
                    class="form-control settings-input"
                    placeholder="Username"
                />
                <button
                    class="btn btn-primary btn-sm mt-2"
                    @click="updateUsername"
                    :disabled="isUpdatingUsername"
                >
                    <span v-if="isUpdatingUsername" class="spinner-border spinner-border-sm me-1"></span>
                    Update
                </button>
            </div>

            <!-- Bio Section -->
            <div class="settings-section">
                <label class="section-label">Bio</label>
                <textarea
                    v-model="bio"
                    class="form-control settings-input"
                    rows="3"
                    placeholder="Bio"
                ></textarea>
            </div>

            <!-- Website Section -->
            <div class="settings-section">
                <label class="section-label">Website</label>
                <p class="text-muted small mb-1">For verified accounts only.</p>
                <input
                    v-model="website"
                    type="url"
                    class="form-control settings-input"
                    placeholder="https://yourwebsite.com"
                    disabled
                />
                <button class="btn btn-primary btn-sm mt-2" disabled>
                    Update
                </button>
            </div>

            <!-- Password Section -->
            <div class="settings-section">
                <label class="section-label">Password</label>
                <input
                    v-model="password"
                    type="password"
                    class="form-control settings-input mb-2"
                    placeholder="Password"
                />
                <input
                    v-model="confirmPassword"
                    type="password"
                    class="form-control settings-input"
                    placeholder="Confirm Password"
                />
                <button
                    class="btn btn-primary btn-sm mt-2"
                    @click="updatePassword"
                    :disabled="isUpdatingPassword"
                >
                    <span v-if="isUpdatingPassword" class="spinner-border spinner-border-sm me-1"></span>
                    Update
                </button>
            </div>

            <!-- Email Section -->
            <div class="settings-section">
                <label class="section-label">Email</label>
                <p class="mb-1">
                    {{ user?.email }}
                    <a href="#" class="text-primary ms-2">(change email)</a>
                </p>
            </div>

            <!-- Options Section -->
            <div class="settings-section">
                <label class="section-label">Options</label>

                <div class="form-check mb-2">
                    <input
                        v-model="options.disableComments"
                        class="form-check-input"
                        type="checkbox"
                        id="disableComments"
                        @change="updateOptions"
                    />
                    <label class="form-check-label" for="disableComments">
                        Disable comments on my albums
                    </label>
                </div>

                <div class="form-check mb-2">
                    <input
                        v-model="options.disableDownload"
                        class="form-check-input"
                        type="checkbox"
                        id="disableDownload"
                        @change="updateOptions"
                    />
                    <label class="form-check-label" for="disableDownload">
                        Disable download on my albums
                    </label>
                </div>

                <div class="form-check mb-2">
                    <input
                        v-model="options.doNotReceiveChat"
                        class="form-check-input"
                        type="checkbox"
                        id="doNotReceiveChat"
                        @change="updateOptions"
                    />
                    <label class="form-check-label" for="doNotReceiveChat">
                        Do not receive chat requests
                    </label>
                </div>

                <div class="form-check mb-2">
                    <input
                        v-model="options.makeAccountPrivate"
                        class="form-check-input"
                        type="checkbox"
                        id="makeAccountPrivate"
                        @change="updateOptions"
                    />
                    <label class="form-check-label" for="makeAccountPrivate">
                        Make my account private
                    </label>
                </div>

                <a href="#" class="text-primary small">Please refer to the FAQ for details</a>
            </div>

            <!-- Blocked Users Section -->
            <div class="settings-section">
                <label class="section-label">Blocked users</label>
                <p class="mb-1">
                    <a href="#" class="text-primary">Manage blocked users for comments</a>
                </p>
                <p class="mb-0">
                    <a href="#" class="text-primary">Manage blocked users for chat</a>
                </p>
            </div>

            <!-- Delete Account Section -->
            <div class="settings-section border-danger">
                <label class="section-label text-danger">Delete my account</label>
                <p class="mb-0">
                    To permanently delete your account
                    <a href="#" class="text-primary">click here</a>.
                </p>
            </div>

        </div>
    </div>
</template>

<style scoped>
.settings-page {
    background-color: var(--bg-dark, #1a1a1a);
    min-height: 100vh;
    color: var(--text-white, #fff);
    padding-bottom: 2rem;
}

.settings-container {
    max-width: 600px;
    margin: 0 auto;
}

.avatar-wrapper {
    width: 100px;
    height: 100px;
    position: relative;
}

.avatar-img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}

.avatar-placeholder {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #555;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    font-weight: bold;
    color: #fff;
}

.avatar-edit-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: var(--primary-color, #ff69b4);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 2px solid var(--bg-dark, #1a1a1a);
}

.avatar-edit-btn i {
    font-size: 0.8rem;
    color: #fff;
}

.username {
    color: var(--primary-color, #ff69b4);
    font-size: 1.5rem;
    font-weight: 600;
}

.settings-section {
    padding: 1rem;
    border-bottom: 1px solid #333;
}

.section-header {
    margin-bottom: 0.5rem;
}

.section-label {
    display: block;
    color: var(--text-secondary, #aaa);
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
}

.settings-input {
    background-color: var(--bg-card, #2a2a2a);
    border: 1px solid #444;
    color: var(--text-white, #fff);
}

.settings-input:focus {
    background-color: var(--bg-card, #2a2a2a);
    border-color: var(--primary-color, #ff69b4);
    box-shadow: none;
    color: var(--text-white, #fff);
}

.settings-input::placeholder {
    color: #666;
}

.settings-input:disabled {
    background-color: #222;
    color: #666;
}

.form-check-input {
    background-color: #333;
    border-color: #555;
}

.form-check-input:checked {
    background-color: var(--primary-color, #ff69b4);
    border-color: var(--primary-color, #ff69b4);
}

.form-check-label {
    color: var(--text-secondary, #ccc);
}

.btn-primary {
    background-color: var(--primary-color, #ff69b4);
    border-color: var(--primary-color, #ff69b4);
}

.btn-primary:hover {
    background-color: #ff4da6;
    border-color: #ff4da6;
}

.border-danger {
    border-color: #dc3545 !important;
}
</style>

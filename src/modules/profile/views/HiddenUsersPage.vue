<template>
    <NavBar />

    <div id="swipes" class="main-content">
        <div class="p-2 d-flex align-items-center gap-2">
            <i class="bi bi-eye-slash-fill fs-3 text-secondary"></i>
            <span class="fs-3 fw-bold text-secondary">Hiddens</span>
        </div>

        <div id="tabs" class="p-2 d-flex gap-4 fs-5">
            <div class="tab-active" style="cursor: pointer;">
                ALL
            </div>
        </div>

        <div v-if="status === 'success'">
            <div v-if="users.length === 0" class="empty-state text-center py-5 my-4">
                <h4 class="text-secondary">Empty</h4>
            </div>

            <div v-else class="hidden-users-list px-2 py-1">
                <div
                    v-for="user in users"
                    :key="user.id"
                    class="d-flex align-items-center justify-content-between py-2 border-bottom border-secondary border-opacity-25"
                >
                    <div class="d-flex align-items-center gap-2">
                        <UserAvatar
                            :name="user.name"
                            :avatarUrl="user.avatar"
                            :to="`/profile/${user.name}`"
                            :size="36"
                        />
                        <router-link
                            :to="`/profile/${user.name}`"
                            class="text-decoration-none text-white fw-bold"
                        >
                            {{ user.name }}
                        </router-link>
                    </div>

                    <button
                        class="btn btn-sm btn-pink fw-bold px-3"
                        :disabled="unblockingId === user.id"
                        @click="handleUnblock(user.id)"
                    >
                        <span v-if="unblockingId === user.id" class="spinner-border spinner-border-sm"></span>
                        <span v-else>Hidden</span>
                    </button>
                </div>
            </div>
        </div>

        <div v-else-if="status === 'loading'" class="text-center py-5">
            <div class="spinner-border text-secondary" role="status"></div>
            <p class="mt-2 text-secondary">carregando...</p>
        </div>

        <div v-else-if="status === 'error'" class="text-center py-5 text-danger">
            <p>Erro ao carregar as contas ocultas.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import NavBar from '../../../core/components/NavBar.vue';
import UserAvatar from '../../../core/components/UserAvatar.vue';
import { useHiddenUsersStore } from '../store/hiddenUsers.store';

const hiddenUsersStore = useHiddenUsersStore();
const { users, status, unblockingId } = storeToRefs(hiddenUsersStore);

onMounted(() => {
    hiddenUsersStore.fetchHiddenUsers();
});

const handleUnblock = (userId: number) => {
    hiddenUsersStore.removeHiddenUser(userId);
};
</script>

<style scoped>
.tab-active {
    color: var(--primary-color, #ff69b4);
    font-weight: 600;
}
</style>

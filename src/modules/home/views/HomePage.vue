<template>

    <NavBar/>

    <!-- only when necessary
    <div>
        <button @click="authStore.logout" >teste</button>
    </div> -->

    <div id="swipes" class="">

        <div class="p-2">
            <i class="bi bi-house-door-fill fs-3"></i> <span class="fs-3">Explore</span>
        </div>
        
        <div id="tabs" class="p-2 d-flex gap-4 fs-5">
            <div
                :class="{ 'tab-active': activeTab === 'home' }"
                @click="activeTab = 'home'"
                style="cursor: pointer;">
                HOME
            </div>
            <div
                :class="{ 'tab-active': activeTab === 'new' }"
                @click="activeTab = 'new'"
                style="cursor: pointer;">
                NEW
            </div>
        </div>

        <div v-if="status == 'success'">

            <div class="row g-3 post-list">

                <template v-for="(post, i) in posts" :key="i">

                    <div class="col-6 col-sm-4 col-md-3 col-lg-2 mb-4">
                        <PostCard class="list-unstyled" 
                            :id="post.id.toString()" 
                            :userId="post.user_id"
                            :thumbnail_path="post.thumbnail_path"
                            :caption="post.caption" 
                            :imageCount="post.image_count" 
                            :videoCount="post.video_count"
                            :first_media="post.first_media" 
                            :user="post.user" 
                            />
                    </div>
                    
                    <div class="col-12 text-center my-4" v-if="(i + 1) % 16 === 0" :ref="(el) => { if (el) sentinelElement = el }">
                        <p class="bg-primary">aqui provavelmente vem um AD</p>
                    </div>

                </template>

            </div>

        </div>

        <div v-else-if="status == 'loading'">
            <p>carregando...</p>
        </div>

    </div>

</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useHomeStore } from '../store/home.store'
import PostCard from '../components/PostCard.vue'
import { onUnmounted, watch, ref } from 'vue'
import { useAuthStore } from '../../auth/store/auth.store'
import NavBar from '../../../core/components/NavBar.vue'

const authStore = useAuthStore()
const homeStore = useHomeStore()
const { posts, status, nextPage } = storeToRefs(homeStore)

const sentinelElement = ref<any | null>(null)
const activeTab = ref('home')

let observer: IntersectionObserver | null = null;

homeStore.listPosts()

watch(sentinelElement, (target) => {

    if (observer) observer.disconnect();

    if (!target) return;

    observer = new IntersectionObserver((entries) => {

        const entry = entries[0];

        if (entry.isIntersecting) {

            // console.log("tocou") esse log da pra ver bem o comportamento do carregamente atencipado da chegada ao fim da tela
            homeStore.getnextpage()
            // Para paginação infinita, geralmente você desconecta o observer 
            // logo após disparar o carregamento para evitar chamadas múltiplas.
            //observer.unobserve(target); 
        }
    }, {threshold: 0, rootMargin: '0px 0px 300px 0px'});

    if (target) {
        observer.observe(target)
    }
})

// desconect a api de IntersectionObserver quando chegar ao fim da paginacao ja que nao vai ser mais necessario
watch(() => nextPage.value, (newNextPage) => {
    if (!newNextPage && observer) {
        observer.disconnect();
    }
});

onUnmounted(() => {
    if (observer) {
        observer.disconnect(); // Desconecta TODAS as observações
    }
});

</script>


<style scoped>
.tab-active {
    color: var(--primary-color, #ff69b4);
}
</style>
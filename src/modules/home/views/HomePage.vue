<template>

    <div>
        HOME <!-- icone de home -->
    </div>

    <div id="swipes" class="">

        <div v-if="status == 'success'">

            <div class="row g-3 post-list">

                <template v-for="(post, i) in posts" :key="i">

                    <div class="col-6 col-sm-4 col-md-3 col-lg-2 mb-4">
                        <PostCard class="list-unstyled" 
                            :id="post.id.toString()" 
                            :userId="post.user_id"
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
import { useCreateHomeStore } from '../store/home.store'
import PostCard from '../components/PostCard.vue'
import { onMounted, onUnmounted, watch, ref } from 'vue'

const homeStore = useCreateHomeStore()
const { posts, status, nextPage } = storeToRefs(homeStore)

const sentinelElement = ref<any | null>(null)

let observer: IntersectionObserver | null = null;

onMounted(() => {
    homeStore.listPosts()
})

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


<style></style>
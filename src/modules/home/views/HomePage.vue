<template>

    <div>
        HOME <!-- icone de home -->
    </div>

    <div id="swipes" class="">

        <div v-if="status == 'success'">

            <div class="row g-3 post-list">

                <PostCard v-for="(post, i) in posts" :key="i" class="list-unstyled"
                    :id="post.id"
                    :userId="post.user_id"
                    :caption="post.caption"
                    :imageCount="post.image_count"
                    :videoCount="post.video_count"
                    :first-media="post.first_media"
                    :user="post.user"
                />
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
 

const homeStore = useCreateHomeStore()
const { posts, status } = storeToRefs(homeStore)

homeStore.listPosts()
</script>


<style></style>
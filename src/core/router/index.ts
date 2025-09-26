import { createRouter, createWebHistory } from 'vue-router'
import CreatePostPage from '../../modules/post/views/CreatePostPage.vue'


const routes = [
    { path: '/', name: 'home', component: CreatePostPage },
    { path: 'createPost', name: 'CreatePost', component: CreatePostPage }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
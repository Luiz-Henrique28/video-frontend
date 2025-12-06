import { createRouter, createWebHistory } from 'vue-router'
import CreatePostPage from '../../modules/post/views/CreatePostPage.vue'
import HomePage from '../../modules/home/views/HomePage.vue'

const routes = [
    { path: '/', name: 'home', component: HomePage },
    { path: '/createPost', name: 'CreatePost', component: CreatePostPage }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
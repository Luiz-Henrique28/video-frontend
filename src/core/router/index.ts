import { createRouter, createWebHistory } from 'vue-router'
import PostCreationPage from '../../modules/post/views/PostCreationPage.vue'
import HomePage from '../../modules/home/views/HomePage.vue'
import PostDetailPage from '../../modules/post/views/PostDetailPage.vue'

const routes = [
    { path: '/', name: 'home', component: HomePage },
    { path: '/post/create', name: 'postCreation', component: PostCreationPage },
    { path: '/post/:id', name: 'postDetail', component: PostDetailPage },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
import { createRouter, createWebHistory } from 'vue-router'
import PostCreationPage from '../../modules/post/views/PostCreationPage.vue'
import HomePage from '../../modules/home/views/HomePage.vue'
import PostDetailPage from '../../modules/post/views/PostDetailPage.vue'
import WelcomePage from '../../modules/auth/views/WelcomePage.vue'
import ProfilePage from '../../modules/profile/views/ProfilePage.vue'
import SettingsPage from '../../modules/profile/views/SettingsPage.vue'
import { useAuthStore } from '../../modules/auth/store/auth.store'

const routes = [
    { path: '/', name: 'welcome', component: WelcomePage },
    { path: '/home', name: 'home', component: HomePage },
    { path: '/post/create', name: 'postCreation', component: PostCreationPage },
    { path: '/post/:id', name: 'postDetail', component: PostDetailPage },
    { path: '/profile', name: 'profile', component: ProfilePage },
    { path: '/settings', name: 'settings', component: SettingsPage },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, _, next) => {
    const authStore = useAuthStore()

    if (to.path === '/' && authStore.isAuthenticate) {
        return next('/home');
    }

    next();
})

export default router
import { createRouter, createWebHistory } from 'vue-router'
import PostCreationPage from '../../modules/post/views/PostCreationPage.vue'
import HomePage from '../../modules/home/views/HomePage.vue'
import PostDetailPage from '../../modules/post/views/PostDetailPage.vue'
import WelcomePage from '../../modules/auth/views/WelcomePage.vue'
import ProfilePage from '../../modules/profile/views/ProfilePage.vue'
import SettingsPage from '../../modules/profile/views/SettingsPage.vue'
import chooseUsername from '../../modules/auth/views/chooseUsername.vue'
import { useAuthStore } from '../../modules/auth/store/auth.store'

const routes = [
    { path: '/', name: 'welcome', component: WelcomePage, meta: { guestOnly: true } },
    { path: '/chooseUsername', name: 'chooseUsername', component: chooseUsername, meta: { incompleteProfileOnly: true } },
    { path: '/home', name: 'home', component: HomePage },

    { path: '/post/create', name: 'postCreation', component: PostCreationPage, meta: { requiresAuth: true } },
    { path: '/post/:id', name: 'postDetail', component: PostDetailPage },
    { path: '/profile', name: 'profile', component: ProfilePage }, // esse aqui tem que ter uma atencao especial, pq como guest da pra ver o o profile dos usuarios mas nao o proprio. Talvez deixar guest only e caso tente acessar o proprio ira da erro e faz um redirect
    { path: '/settings', name: 'settings', component: SettingsPage, meta: { requiresAuth: true } },

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, _, next) => {
    const authStore = useAuthStore() //talvez faca mais sentido colocar isso para fora

    const isAuth = authStore.isAuthenticated
    const isComplete = authStore.isProfileComplete

    if (to.meta.guestOnly && isAuth) {
        return next(isComplete ? '/home' : '/chooseUsername')
    }

    if (to.meta.incompleteProfileOnly) {
        if (!isAuth) return next('/')
        if (isComplete) return next('/home')
    }

    if (to.meta.requiresAuth && !isAuth) return next('/')

    next();
})

export default router
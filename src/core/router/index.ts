import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../../modules/auth/store/auth.store'

const routes = [
    {
        path: '/',
        name: 'welcome',
        component: () => import('../../modules/auth/views/WelcomePage.vue'),
        meta: { guestOnly: true }
    },
    {
        path: '/chooseUsername',
        name: 'chooseUsername',
        component: () => import('../../modules/auth/views/ChooseUsernamePage.vue'),
        meta: { incompleteProfileOnly: true }
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('../../modules/home/views/HomePage.vue')
    },
    {
        path: '/post/create',
        name: 'postCreation',
        component: () => import('../../modules/post/views/PostCreationPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/post/:id',
        name: 'postDetail',
        component: () => import('../../modules/post/views/PostDetailPage.vue')
    },
    {
        path: '/saved',
        name: 'savedPosts',
        component: () => import('../../modules/post/views/SavedPostsPage.vue'),
        meta: { requiresAuth: true }
    },
    // Perfil proprio (auth obrigatoria - redireciona pelo username do store)
    {
        path: '/profile',
        name: 'myProfile',
        component: () => import('../../modules/profile/views/ProfilePage.vue'),
        meta: { requiresAuth: true }
    },
    // Perfil publico de qualquer usuario (acessivel sem auth)
    {
        path: '/profile/:username',
        name: 'userProfile',
        component: () => import('../../modules/profile/views/ProfilePage.vue')
    },
    {
        path: '/settings',
        name: 'settings',
        component: () => import('../../modules/profile/views/SettingsPage.vue'),
        meta: { requiresAuth: true }
    },
    // Rota curinga para 404
    {
        path: '/:pathMatch(.*)*',
        name: 'notFound',
        component: () => import('../views/NotFoundPage.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, _, next) => {
    const authStore = useAuthStore();

    if (!authStore.hasCheckedAuth){
        await authStore.initAuth();
    } 

    const isAuth = authStore.isAuthenticated;
    const isComplete = authStore.isProfileComplete;

    if (to.meta.guestOnly && isAuth) {
        return next(isComplete ? '/home' : '/chooseUsername');
    }

    if (to.meta.incompleteProfileOnly) {
        if (!isAuth) return next('/');
        if (isComplete) return next('/home');
    }

    if (isAuth && !isComplete && to.name !== 'chooseUsername') {
        return next('/chooseUsername');
    }

    if (to.meta.requiresAuth && !isAuth) return next('/');

    next();
})

export default router

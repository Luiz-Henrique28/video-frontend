import { createApp } from 'vue'

import App from './App.vue'
import { pinia } from './core/store/index'
import router from './core/router'
import { useAuthStore } from './modules/auth/store/auth.store'

import './assets/styles/style.css'

const app = createApp(App)

app.use(pinia)
app.use(router)

const authStore = useAuthStore()
authStore.initAuth()

app.mount('#app')

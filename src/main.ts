import { createApp } from 'vue'

import App from './App.vue'
import { pinia } from './core/store/index'
import router from './core/router'
import { onUnauthorized } from './core/services/http'
import { useAuthStore } from './modules/auth/store/auth.store'

import './assets/styles/style.css'

const app = createApp(App)

app.use(pinia)
app.use(router)

// Listener desacoplado para expiração de sessão (401)
// Limpa o estado reativo do Pinia e redireciona sem criar dependência circular no http.ts
onUnauthorized(() => {
    const authStore = useAuthStore()
    authStore.resetAuth()
    router.push('/')
})

app.mount('#app')

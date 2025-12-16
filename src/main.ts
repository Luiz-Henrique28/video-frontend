import { createApp } from 'vue'

import App from './App.vue'
import { pinia } from './core/store/index'
import router from './core/router'
    
import './assets/styles/style.css'

createApp(App).use(pinia).use(router).mount('#app')

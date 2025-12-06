import { createApp } from 'vue'

import App from './App.vue'
import { pinia } from './core/store/index'
import router from './core/router'


createApp(App).use(pinia).use(router).mount('#app')

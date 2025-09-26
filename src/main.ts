import { createApp } from 'vue'

import App from './App.vue'
import { pinia } from './core/store/index'


createApp(App).use(pinia).mount('#app')

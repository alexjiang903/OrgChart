import './assets/tailwind.css';
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia();

createApp(App).use(pinia)
createApp(App).mount('#app')

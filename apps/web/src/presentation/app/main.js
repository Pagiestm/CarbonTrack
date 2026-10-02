import '@/assets/tailwind.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from '@/presentation/app/App.vue';
import router from '@/presentation/app/router.js';

createApp(App).use(createPinia()).use(router).mount('#app');

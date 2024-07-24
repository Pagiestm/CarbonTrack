// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import RegisterForm from '../components/RegisterForm.vue';

const routes = [
  {
    path: '/register',
    name: 'Register',
    component: RegisterForm,
  },
  // Ajoutez d'autres routes ici si nécessaire
];

const router = createRouter({
  history: createWebHistory(''),
  routes,
});

export default router;
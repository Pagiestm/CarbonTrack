import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import LoginForm from '../views/LoginForm.vue';
import RegisterForm from '../views/RegisterForm.vue';
import ProfilePage from '../views/ProfilePage.vue';

const routes = [
    { path: '/', name: 'Home', component: HomePage },
    { path: '/login', name: 'Login', component: LoginForm },
    { path: '/register', name: 'Register', component: RegisterForm },
    {  path: '/profile', name: 'Profile', component: ProfilePage, meta: { requiresAuth: true } },
];

const router = createRouter({
    history: createWebHistory('/'),
    routes,
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('authToken');
    if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
        next('/login');
    } else {
        next();
    }
});

export default router;
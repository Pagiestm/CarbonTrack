import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/Home/HomePage.vue';
import LoginForm from '../views/LoginPage.vue';
import NotFound from '../views/NotFound.vue';
import RegisterForm from '../views/RegisterPage.vue';
import ProfilePage from '../views/Profile/ProfilePage.vue';
import EditProfilePage from '../views/Profile/EditProfilePage.vue';
import AdminPage from '../views/Admin/AdminPage.vue';
import Materials from '../views/Admin/MaterialsPage.vue';
import CreateMaterialPage from '../views/Admin/CreateMaterialPage.vue';
import EditMaterialPage from '../views/Admin/EditMaterialPage.vue';
import ProjectPage from '../views/Project/ProjectPage.vue';
import ProjectDetailsPage from '../views/Project/ProjectDetailsPage.vue';
import CreateProjectPage from '../views/Project/CreateProjectPage.vue';
import EditProjectPage from '../views/Project/EditProjectPage.vue'; 

const routes = [
    { path: '/', name: 'Home', component: HomePage },
    { path: '/login', name: 'Login', component: LoginForm },
    { path: '/register', name: 'Register', component: RegisterForm },
    { path: '/profile', name: 'Profile', component: ProfilePage, meta: { requiresAuth: true } },
    { path: '/profile/edit', name: 'EditProfile', component: EditProfilePage, meta: { requiresAuth: true } },
    { path: '/projects', name: 'UserProjects', component: ProjectPage, meta: { requiresAuth: true } },
    { path: '/projects/:id', name: 'ProjectDetailsPage', component: ProjectDetailsPage, props: true },
    { path: '/projects/create', name: 'CreateProjectPage', component: CreateProjectPage, meta: { requiresAuth: true } },
    { path: '/projects/edit/:id', name: 'EditProjectPage', component: EditProjectPage, meta: { requiresAuth: true } },
    {
        path: '/admin', name: 'Admin', component: AdminPage, meta: { requiresAdmin: true }, children: [
            {
                path: 'materials',
                name: 'Materials',
                component: Materials,
            },
            {
                path: '/materials/create',
                name: 'CreateMaterialPage',
                component: CreateMaterialPage
            },
            {
                path: '/materials/edit/:id',
                name: 'EditMaterialPage',
                component: EditMaterialPage
            },
        ],
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
];

const router = createRouter({
    history: createWebHistory('/'),
    routes,
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('authToken');
    const role = localStorage.getItem('role');

    const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    switch (true) {
        case requiresAdmin:
            if (isAuthenticated && role === 'ADMIN') {
                next();
            } else {
                next({ name: 'NotFound' });
            }
            break;
        case requiresAuth:
            if (isAuthenticated) {
                next();
            } else {
                next('/login');
            }
            break;
        default:
            next();
    }
});

export default router;

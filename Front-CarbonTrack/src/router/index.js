import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/Home/HomePage.vue';
import LoginForm from '../views/LoginPage.vue';
import NotFound from '../views/NotFound.vue';
import RegisterForm from '../views/RegisterPage.vue';
import ContactPage from '../views/ContactPage.vue';
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
import CategoriesPage from '../views/Admin/CategoriesPage.vue';
import CreateCategoryPage from '../views/Admin/CreateCategoryPage.vue';
import EditCategoryPage from '../views/Admin/EditCategoryPage.vue';
import RequestPasswordReset from '../views/PasswordReset/RequestPasswordReset.vue';
import ResetPassword from '../views/PasswordReset/ResetPassword.vue';

const routes = [
    { path: '/', name: 'Home', component: HomePage, meta: { title: "CarbonTrack - Accueil" } },
    { path: '/login', name: 'Login', component: LoginForm, meta: { title: "CarbonTrack - Authentification" } },
    { path: '/register', name: 'Register', component: RegisterForm, meta: { title: "CarbonTrack - Inscription" } },
    { path: '/contact', component: ContactPage, meta: { title: "CarbonTrack - Contact" } },
    { path: '/profile', name: 'Profile', component: ProfilePage, meta: { title: "CarbonTrack - Profil", requiresAuth: true } },
    { path: '/profile/edit', name: 'EditProfile', component: EditProfilePage, meta: { title: "CarbonTrack - Modifier le profil", requiresAuth: true } },
    { path: '/projects', name: 'UserProjects', component: ProjectPage, meta: { title: "CarbonTrack - Mes projets", requiresAuth: true } },
    { path: '/projects/:id', name: 'ProjectDetailsPage', component: ProjectDetailsPage, props: true, meta: { title: "CarbonTrack - Projet", requiresAuth: true } },
    { path: '/projects/create', name: 'CreateProjectPage', component: CreateProjectPage, meta: { title: "CarbonTrack - Créer un projet", requiresAuth: true } },
    { path: '/projects/edit/:id', name: 'EditProjectPage', component: EditProjectPage, meta: { title: "CarbonTrack - Modifier un projet", requiresAuth: true } },
    { path: '/password-reset/request', name: 'RequestPasswordReset', component: RequestPasswordReset, meta: { title: "CarbonTrack - Demande de réinitialisation du mot de passe" } },
    {
        path: '/reset-password',
        name: 'ResetPassword',
        component: ResetPassword,
        meta: { title: "CarbonTrack - Modifier le mot de passe" },
        props: route => ({ token: route.query.token })
    },
    {
        path: '/admin', name: 'Admin', component: AdminPage, meta: { title: "CarbonTrack - Administration", requiresAuth: true, requiresAdmin: true }, children: [
            {
                path: 'materials',
                name: 'Materials',
                component: Materials,
                meta: { title: "CarbonTrack - Admin - Matériaux" },
            },
            {
                path: '/materials/create',
                name: 'CreateMaterialPage',
                component: CreateMaterialPage,
                meta: { title: "CarbonTrack - Admin - Ajouter un matériau" },
            },
            {
                path: '/materials/edit/:id',
                name: 'EditMaterialPage',
                component: EditMaterialPage,
                meta: { title: "CarbonTrack - Admin - Modifier un matériau" },
            },
            {
                path: 'categories',
                name: 'Categories',
                component: CategoriesPage,
                meta: { title: "CarbonTrack - Admin - Catégories" },
            },
            {
                path: '/categories/create',
                name: 'CreateCategoryPage',
                component: CreateCategoryPage,
                meta: { title: "CarbonTrack - Admin - Ajouter une catégorie" },
            },
            {
                path: '/categories/edit/:id',
                name: 'EditCategoryPage',
                component: EditCategoryPage,
                meta: { title: "CarbonTrack - Admin - Modifier une catégorie" },
            }
        ],
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound, meta: { title: "CarbonTrack - 404" }, },
];

const router = createRouter({
    history: createWebHistory('/'),
    routes,
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title || 'CarbonTrack'}`;
    next();
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

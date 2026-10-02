import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/presentation/modules/home/HomePage.vue';
import { useSessionStore } from '@/presentation/stores/session.js';

const routes = [
  { path: '/', name: 'Home', component: HomePage, meta: { title: 'CarbonTrack' } },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/presentation/modules/auth/LoginPage.vue'),
    meta: { title: 'CarbonTrack - Authentification' },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/presentation/modules/auth/RegisterPage.vue'),
    meta: { title: 'CarbonTrack - Inscription' },
  },
  {
    path: '/password-reset/request',
    name: 'RequestPasswordReset',
    component: () => import('@/presentation/modules/auth/RequestPasswordResetPage.vue'),
    meta: { title: 'CarbonTrack - Demande de réinitialisation du mot de passe' },
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('@/presentation/modules/auth/ResetPasswordPage.vue'),
    meta: { title: 'CarbonTrack - Modifier le mot de passe' },
    props: (route) => ({ token: route.query.token }),
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/presentation/modules/contact/ContactPage.vue'),
    meta: { title: 'CarbonTrack - Contact' },
  },

  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/presentation/modules/profile/ProfilePage.vue'),
    meta: { title: 'CarbonTrack - Profil', requiresAuth: true },
  },
  {
    path: '/profile/password',
    name: 'ChangePassword',
    component: () => import('@/presentation/modules/profile/ChangePasswordPage.vue'),
    meta: { title: 'CarbonTrack - Mot de passe', requiresAuth: true },
  },
  {
    path: '/profile/edit',
    name: 'EditProfile',
    component: () => import('@/presentation/modules/profile/EditProfilePage.vue'),
    meta: { title: 'CarbonTrack - Modifier le profil', requiresAuth: true },
  },

  {
    path: '/projects',
    name: 'UserProjects',
    component: () => import('@/presentation/modules/projects/ProjectsPage.vue'),
    meta: { title: 'CarbonTrack - Mes projets', requiresAuth: true },
  },
  {
    path: '/projects/create',
    name: 'CreateProjectPage',
    component: () => import('@/presentation/modules/projects/CreateProjectPage.vue'),
    meta: { title: 'CarbonTrack - Créer un projet', requiresAuth: true },
  },
  {
    path: '/projects/:id',
    name: 'ProjectDetailsPage',
    component: () => import('@/presentation/modules/projects/ProjectDetailsPage.vue'),
    props: true,
    meta: { title: 'CarbonTrack - Projet', requiresAuth: true },
  },
  {
    path: '/projects/edit/:id',
    name: 'EditProjectPage',
    component: () => import('@/presentation/modules/projects/EditProjectPage.vue'),
    meta: { title: 'CarbonTrack - Modifier un projet', requiresAuth: true },
  },

  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/presentation/modules/admin/AdminLayout.vue'),
    meta: { title: 'CarbonTrack - Administration', requiresAuth: true, requiresAdmin: true },
    redirect: { name: 'Dashboard' },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/presentation/modules/admin/DashboardPage.vue'),
        meta: { title: 'CarbonTrack - Admin - Dashboard' },
      },
      {
        path: 'projects',
        name: 'AdminProjects',
        component: () => import('@/presentation/modules/admin/projects/AdminProjectsPage.vue'),
        meta: { title: 'CarbonTrack - Admin - Projets' },
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/presentation/modules/admin/users/UsersPage.vue'),
        meta: { title: 'CarbonTrack - Admin - Comptes' },
      },
      {
        path: 'materials',
        name: 'Materials',
        component: () => import('@/presentation/modules/admin/materials/MaterialsPage.vue'),
        meta: { title: 'CarbonTrack - Admin - Matériaux' },
      },
      {
        path: '/materials/create',
        name: 'CreateMaterialPage',
        component: () => import('@/presentation/modules/admin/materials/CreateMaterialPage.vue'),
        meta: { title: 'CarbonTrack - Admin - Ajouter un matériau' },
      },
      {
        path: '/materials/edit/:id',
        name: 'EditMaterialPage',
        component: () => import('@/presentation/modules/admin/materials/EditMaterialPage.vue'),
        meta: { title: 'CarbonTrack - Admin - Modifier un matériau' },
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('@/presentation/modules/admin/categories/CategoriesPage.vue'),
        meta: { title: 'CarbonTrack - Admin - Catégories' },
      },
      {
        path: '/categories/create',
        name: 'CreateCategoryPage',
        component: () => import('@/presentation/modules/admin/categories/CreateCategoryPage.vue'),
        meta: { title: 'CarbonTrack - Admin - Ajouter une catégorie' },
      },
      {
        path: '/categories/edit/:id',
        name: 'EditCategoryPage',
        component: () => import('@/presentation/modules/admin/categories/EditCategoryPage.vue'),
        meta: { title: 'CarbonTrack - Admin - Modifier une catégorie' },
      },
    ],
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/presentation/app/NotFoundPage.vue'),
    meta: { title: 'CarbonTrack - 404' },
  },
];

const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

router.beforeEach((to) => {
  document.title = to.meta.title || 'CarbonTrack';

  const session = useSessionStore();
  session.rafraichir();

  const exigeAdmin = to.matched.some((route) => route.meta.requiresAdmin);
  const exigeAuth = to.matched.some((route) => route.meta.requiresAuth);

  if (exigeAdmin && !session.estAdmin) {
    return { name: 'NotFound', params: { pathMatch: to.path.substring(1).split('/') } };
  }
  if (exigeAuth && !session.estConnecte) {
    return { name: 'Login', query: { suite: to.fullPath } };
  }
});

export default router;

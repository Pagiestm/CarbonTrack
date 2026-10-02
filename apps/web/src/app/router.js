import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/features/home/HomePage.vue';
import { isAdmin, isAuthenticated } from '@/shared/auth/session';

// Les pages, hors accueil, sont chargées à la demande : chacune devient un
// fichier JavaScript séparé au build.
const routes = [
  { path: '/', name: 'Home', component: HomePage, meta: { title: 'CarbonTrack' } },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/features/auth/LoginPage.vue'),
    meta: { title: 'CarbonTrack - Authentification' },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/features/auth/RegisterPage.vue'),
    meta: { title: 'CarbonTrack - Inscription' },
  },
  {
    path: '/password-reset/request',
    name: 'RequestPasswordReset',
    component: () => import('@/features/auth/RequestPasswordResetPage.vue'),
    meta: { title: 'CarbonTrack - Demande de réinitialisation du mot de passe' },
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('@/features/auth/ResetPasswordPage.vue'),
    meta: { title: 'CarbonTrack - Modifier le mot de passe' },
    props: (route) => ({ token: route.query.token }),
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/features/contact/ContactPage.vue'),
    meta: { title: 'CarbonTrack - Contact' },
  },

  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/features/profile/ProfilePage.vue'),
    meta: { title: 'CarbonTrack - Profil', requiresAuth: true },
  },
  {
    path: '/profile/edit',
    name: 'EditProfile',
    component: () => import('@/features/profile/EditProfilePage.vue'),
    meta: { title: 'CarbonTrack - Modifier le profil', requiresAuth: true },
  },

  {
    path: '/projects',
    name: 'UserProjects',
    component: () => import('@/features/projects/ProjectsPage.vue'),
    meta: { title: 'CarbonTrack - Mes projets', requiresAuth: true },
  },
  {
    path: '/projects/create',
    name: 'CreateProjectPage',
    component: () => import('@/features/projects/CreateProjectPage.vue'),
    meta: { title: 'CarbonTrack - Créer un projet', requiresAuth: true },
  },
  {
    path: '/projects/:id',
    name: 'ProjectDetailsPage',
    component: () => import('@/features/projects/ProjectDetailsPage.vue'),
    props: true,
    meta: { title: 'CarbonTrack - Projet', requiresAuth: true },
  },
  {
    path: '/projects/edit/:id',
    name: 'EditProjectPage',
    component: () => import('@/features/projects/EditProjectPage.vue'),
    meta: { title: 'CarbonTrack - Modifier un projet', requiresAuth: true },
  },

  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/features/admin/AdminLayout.vue'),
    meta: { title: 'CarbonTrack - Administration', requiresAuth: true, requiresAdmin: true },
    redirect: { name: 'Dashboard' },
    // Certains chemins enfants sont absolus (/materials/create…) : ils
    // restent rendus dans la mise en page d'administration.
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/features/admin/DashboardPage.vue'),
        meta: { title: 'CarbonTrack - Admin - Dashboard' },
      },
      {
        path: 'materials',
        name: 'Materials',
        component: () => import('@/features/admin/materials/MaterialsPage.vue'),
        meta: { title: 'CarbonTrack - Admin - Matériaux' },
      },
      {
        path: '/materials/create',
        name: 'CreateMaterialPage',
        component: () => import('@/features/admin/materials/CreateMaterialPage.vue'),
        meta: { title: 'CarbonTrack - Admin - Ajouter un matériau' },
      },
      {
        path: '/materials/edit/:id',
        name: 'EditMaterialPage',
        component: () => import('@/features/admin/materials/EditMaterialPage.vue'),
        meta: { title: 'CarbonTrack - Admin - Modifier un matériau' },
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('@/features/admin/categories/CategoriesPage.vue'),
        meta: { title: 'CarbonTrack - Admin - Catégories' },
      },
      {
        path: '/categories/create',
        name: 'CreateCategoryPage',
        component: () => import('@/features/admin/categories/CreateCategoryPage.vue'),
        meta: { title: 'CarbonTrack - Admin - Ajouter une catégorie' },
      },
      {
        path: '/categories/edit/:id',
        name: 'EditCategoryPage',
        component: () => import('@/features/admin/categories/EditCategoryPage.vue'),
        meta: { title: 'CarbonTrack - Admin - Modifier une catégorie' },
      },
    ],
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/app/NotFoundPage.vue'),
    meta: { title: 'CarbonTrack - 404' },
  },
];

const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

router.beforeEach((to) => {
  document.title = to.meta.title || 'CarbonTrack';

  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  // Une page d'administration n'existe pas pour qui n'est pas administrateur.
  if (requiresAdmin && !(isAuthenticated() && isAdmin())) {
    return { name: 'NotFound', params: { pathMatch: to.path.substring(1).split('/') } };
  }
  if (requiresAuth && !isAuthenticated()) {
    return { name: 'Login' };
  }
});

export default router;

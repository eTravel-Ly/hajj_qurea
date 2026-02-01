import { createRouter, createWebHistory } from 'vue-router';
import { authState } from '../services/auth';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Qurea from '../views/Qurea.vue';
import info from '../views/info.vue';

// Secret key - you can move this to environment variable
const VALID_ROUTE_KEY = import.meta.env.VITE_ROUTE_KEY || '72054865-9308-4095-9950-323c22221980';
const routes = [
    {
        path: '/',
        name: 'dashboard',
        component: Dashboard,
        meta: { requiresKey: false, requiresAuth: true }
        // meta: { requiresAuth: true }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { requiresKey: false, requiresAuth: false }
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresKey: false, requiresAuth: true }
    },
    {
        path: '/qurea/:officeId',
        name: 'Qurea',
        component: Qurea,
        meta: { requiresKey: false, requiresAuth: true }
        // meta: { requiresAuth: true }

    },
    {
        path: '/info',
        name: 'info',
        component: info,
        meta: { requiresKey: false, requiresAuth: true }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    // Check for key requirement
    if (to.meta.requiresKey) {
        const routeKey = to.query.key;
        if (!routeKey || routeKey !== VALID_ROUTE_KEY) {
            // Redirect to external URL if key is missing/invalid
            window.location.href = 'http://google.com/';
            return;
        }
    }

    // Check for auth requirement
    if (to.meta.requiresAuth && !authState.isAuthenticated) {
        next('/login');
    } else {
        next();
    }
});

export default router;

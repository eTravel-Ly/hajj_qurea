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
    },
    {
        path: '/countdown',
        name: 'Countdown',
        component: () => import('../views/Countdown.vue'), // Lazy load
        meta: { requiresKey: false, requiresAuth: false }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// COUNTDOWN DATE CONFIGURATION
// User requested: 07-02-2020 10 AM +02:00
// Since 2020 is in the past, we use 2026 (current year) for demonstration.
// Change year to 2020 if strictly required, but it will expire immediately.
// const COUNTDOWN_DATE = new Date("2026-02-07T10:00:00+02:00");

router.beforeEach((to, from, next) => {
    // Countdown Enforcer
    const now = new Date();
    if (now < COUNTDOWN_DATE) {
        if (to.path !== '/countdown') {
            return next('/countdown');
        }
        // If targeting countdown, allow it and skip other checks
        return next();
    } else {
        // If countdown expired and user tries to go to countdown page
        if (to.path === '/countdown') {
            return next('/');
        }
    }

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

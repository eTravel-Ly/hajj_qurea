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
        name: 'login',
        component: Login,
        meta: { requiresKey: false, requiresAuth: false }
        // meta: { requiresAuth: true }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { requiresKey: false, requiresAuth: false }
    },
    // {
    //     path: '/dashboard',
    //     name: 'Dashboard',
    //     component: Dashboard,
    //     meta: { requiresKey: false, requiresAuth: true }
    // },
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
        meta: { requiresKey: false, requiresAuth: true }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

import { COUNTDOWN_TARGET_DATE } from '../constants';
const COUNTDOWN_DATE = new Date("2026-02-02T18:54:00+02:00");

router.beforeEach((to, from, next) => {
    // 1. Check for key requirement (Public/Private check)
    if (to.meta.requiresKey) {
        const routeKey = to.query.key;
        if (!routeKey || routeKey !== VALID_ROUTE_KEY) {
            window.location.href = 'http://google.com/';
            return;
        }
    }

    // 2. Check for auth requirement
    if (to.meta.requiresAuth && !authState.isAuthenticated) {
        // If not authenticated, redirect to login

        return next('/login');
    }

    // 3. Countdown Enforcer (Only if authenticated or public route)
    const now = new Date();
    // Allow access to login always
    if (to.path !== '/login') {
        if (now < COUNTDOWN_DATE) {
            // Countdown is active
            if (to.path !== '/countdown') {
                // If trying to access Qurea page, preserve the officeId in query params
                if (to.params.officeId) {
                    return next({ path: '/countdown', query: { officeId: to.params.officeId } });
                }
                return next('/countdown');
            }
        } else {
            // Countdown expired
            if (to.path === '/countdown') {
                if (to.query.officeId) {
                    return next(`/qurea/${to.query.officeId}`);
                }
                return next('/');
            }
        }
    }

    // 4. Default: allow navigation
    next();
});

export default router;

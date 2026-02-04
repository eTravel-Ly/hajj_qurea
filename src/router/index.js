import { createRouter, createWebHistory } from 'vue-router';
import { authState } from '../services/auth';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Qurea from '../views/Qurea.vue';
import info from '../views/info.vue';
import RoleIndicator from '../views/RoleIndicator.vue';

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
    },
    {
        path: '/role-indicator',
        name: 'RoleIndicator',
        component: RoleIndicator,
        meta: { requiresKey: false, requiresAuth: true }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

import { COUNTDOWN_TARGET_DATE } from '../constants';
const COUNTDOWN_DATE = new Date("2026-02-03T20:05:00+02:00");

import api from '../services/api';
import { parseJwt } from '../services/auth';

let isLotteryConfirmedStarted = false;

router.beforeEach(async (to, from, next) => {
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

    // 3. Countdown blocked routing & Server Status Check
    // First, check local time
    const now = new Date();
    if (now < COUNTDOWN_DATE) {
        const allowedRoutes = ['Countdown', 'info', 'RoleIndicator', 'Login', 'login'];
        if (!allowedRoutes.includes(to.name)) {
            return next({ name: 'Countdown' });
        }
    } else {
        // Date has passed, but we MUST verify if the lottery actually started on server
        if (to.name === 'Qurea') {
            // Optimization: if we already confirmed it started once, skip check
            if (isLotteryConfirmedStarted) {
                return next();
            }

            try {
                // Determine which status endpoint to check based on role
                const token = localStorage.getItem('app-token');
                let hasIndicatorRole = false;
                if (token) {
                    const decoded = parseJwt(token);
                    hasIndicatorRole = decoded?.realm_access?.roles?.includes('qurea-role-indicators');
                }

                let response;
                if (hasIndicatorRole) {
                    response = await api.getQureaStatusindicators();
                } else {
                    response = await api.getQureaStatus();
                }

                if (response.data?.object?.isStart === true) {
                    isLotteryConfirmedStarted = true;
                    return next();
                } else {
                    // Not started yet -> Force back to Countdown (Waiting mode)
                    return next({ name: 'Countdown' });
                }
            } catch (error) {
                console.error("Router status check failed:", error);
                // On error, safest is to block access
                return next({ name: 'Countdown' });
            }
        }
    }

    // 4. Default: allow navigation
    next();
});

export default router;

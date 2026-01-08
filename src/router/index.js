import { createRouter, createWebHistory } from 'vue-router';
import { authState } from '../services/auth';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Qurea from '../views/Qurea.vue';
const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/qurea/:officeId',
        name: 'Qurea',
        component: Qurea,
        meta: { requiresAuth: true }

    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !authState.isAuthenticated) {
        next('/login');
    } else {
        next();
    }
});

export default router;

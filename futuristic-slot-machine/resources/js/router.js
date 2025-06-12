import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Auth/Login.vue';
import Register from './components/Auth/Register.vue';
import SlotMachine from './components/Game/SlotMachine.vue';
import ProfileView from './components/Profile/ProfileView.vue';
import ProfileEdit from './components/Profile/ProfileEdit.vue';

const routes = [
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/', component: SlotMachine, meta: { requiresAuth: true } },
    { path: '/profile', component: ProfileView, meta: { requiresAuth: true } },
    { path: '/profile/edit', component: ProfileEdit, meta: { requiresAuth: true } },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('token');
    
    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login');
    } else {
        next();
    }
});

export default router;
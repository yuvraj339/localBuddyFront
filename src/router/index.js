import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

const routes = [
    {
        path: "/",
        name: "Home",
        component: () => import("../views/Home.vue"),
    },
    {
        path: "/login",
        name: "Login",
        component: () => import("../views/Login.vue"),
    },
    {
        path: "/register",
        name: "Register",
        component: () => import("../views/Register.vue"),
    },
    {
        path: "/helpers",
        name: "Helpers",
        component: () => import("../views/Helpers.vue"),
    },
    {
        path: "/helper/:id",
        name: "HelperDetail",
        component: () => import("../views/HelperDetail.vue"),
    },
    {
        path: "/dashboard",
        name: "Dashboard",
        component: () => import("../views/Dashboard.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/helper-dashboard",
        name: "HelperDashboard",
        component: () => import("../views/HelperDashboard.vue"),
        meta: { requiresAuth: true, role: "helper" },
    },
    {
        path: "/bookings",
        name: "Bookings",
        component: () => import("../views/Bookings.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/chat",
        name: "Chat",
        component: () => import("../views/Chat.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/profile",
        name: "Profile",
        component: () => import("../views/Profile.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/admin",
        name: "Admin",
        component: () => import("../views/Admin.vue"),
        meta: { requiresAuth: true, role: "admin" },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next("/login");
    } else if (to.meta.role && authStore.user?.role !== to.meta.role) {
        next("/dashboard");
    } else {
        next();
    }
});

export default router;

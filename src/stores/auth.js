import { defineStore } from "pinia";
import { api } from "../services/api";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: null,
        token: localStorage.getItem("token") || null,
        loading: false,
        error: null,
        roles: [],
        user_roles: [],
        permissions: [],
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        hasRole: (state) => (role) =>
            state.roles.filter((r) => r.name === role).length > 0,
        hasPermission: (state) => (perm) => state.permissions.includes(perm),
        getRoles: (state) => state.roles,
        getPermissions: (state) => (role) => state.permissions[role] || [],
    },

    actions: {
        async login(email, password) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.login(email, password);
                if (response.success) {
                    this.token = response.token;
                    this.user = response.data;
                    this.roles = response.data.roles || [];
                    this.user_roles =
                        response.user_roles || response.data.roles || [];
                    localStorage.setItem("token", response.token);
                    localStorage.setItem("user", JSON.stringify(response.data));
                    localStorage.setItem(
                        "user_roles",
                        JSON.stringify(this.user_roles)
                    );
                    await this.fetchRolesAndPermissions();
                    return true;
                } else {
                    this.error = response.error || "Login failed";
                    return false;
                }
            } catch (error) {
                this.error = error.message;
                return false;
            } finally {
                this.loading = false;
            }
        },

        async register(userData) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.register(userData);
                if (response.success) {
                    this.token = response.token;
                    this.user = response.data;
                    localStorage.setItem("token", response.token);
                    localStorage.setItem("user", JSON.stringify(response.data));
                    // Fetch roles and permissions
                    // await this.fetchRolesAndPermissions();
                    return true;
                } else {
                    this.error = response.error || "Registration failed";
                    return false;
                }
            } catch (error) {
                this.error = error.message;
                return false;
            } finally {
                this.loading = false;
            }
        },
        async fetchRolesAndPermissions() {
            if (!this.user?.id || this.user.roles.length === 0) return;
            try {
                const permsResp = await new Promise(async (resolve) => {
                    const perms = await api.getUserPermissions(
                        this.user.roles[0].id
                    );
                    resolve([perms]);
                });
                this.permissions = permsResp[0].success
                    ? permsResp[0].data
                    : [];
                localStorage.setItem(
                    "permissions",
                    JSON.stringify(this.permissions)
                );
            } catch (error) {
                if (error.response?.status === 401) {
                    this.handleTokenExpiration();
                }
            }
        },

        handleTokenExpiration() {
            this.logout();
            window.location.href = "/login"; // Redirect to login page
        },

        updateUserState(newUserData) {
            this.user = { ...this.user, ...newUserData };
            localStorage.setItem("user", JSON.stringify(this.user));
        },
        async getUser() {
            const resp = await api.getUserProfile();
            if (resp.success) {
                this.user = resp.data;
                return true;
            } else {
                return false;
            }
        },
        logout() {
            this.user = null;
            this.token = null;
            this.roles = [];
            this.user_roles = [];
            this.permissions = [];
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("user_roles");
            localStorage.removeItem("permissions");
            localStorage.removeItem("categories");
            localStorage.removeItem("helpers");
        },

        async loadUser() {
            const savedUser = localStorage.getItem("user");
            const savedUserRoles = localStorage.getItem("user_roles");
            const permissions = localStorage.getItem("permissions");
            if (permissions) {
                this.permissions = JSON.parse(permissions);
            }
            if (savedUserRoles) {
                this.user_roles = JSON.parse(savedUserRoles);
            }
            if (savedUser) {
                this.user = JSON.parse(savedUser);
                this.roles = this.user.roles || [];
            }
        },
    },
});

import { defineStore } from "pinia";
import { api } from "../services/api";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: null,
        token: localStorage.getItem("token") || null,
        loading: false,
        error: null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        isHelper: (state) => state.user?.role === "helper",
        isCustomer: (state) => state.user?.role === "customer",
        isAdmin: (state) => state.user?.role === "admin",
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
                    localStorage.setItem("token", response.token);
                    localStorage.setItem("user", JSON.stringify(response.data));
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

        logout() {
            this.user = null;
            this.token = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },

        async loadUser() {
            const savedUser = localStorage.getItem("user");
            if (savedUser) {
                this.user = JSON.parse(savedUser);
            }
        },
    },
});

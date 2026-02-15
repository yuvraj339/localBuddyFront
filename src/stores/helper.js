import { defineStore } from "pinia";
import { api } from "../services/api";

export const useHelperStore = defineStore("helper", {
    state: () => ({
        helpers: [],
        categories: [],
        currentHelper: null,
        filters: {
            category: "",
            minRate: null,
            maxRate: null,
            minRating: null,
            search: "",
        },
        loading: false,
        error: null,
    }),

    getters: {
        filteredHelpers: (state) => state.helpers,
        topRatedHelpers: (state) =>
            [...state.helpers].sort((a, b) => b.rating - a.rating).slice(0, 6),
    },

    actions: {
        async fetchHelpers() {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.getHelpers(this.filters);

                if (response.success) {
                    this.helpers = response.data;
                } else {
                    this.error = response.error;
                }
            } catch (error) {
                this.error = error.message;
            } finally {
                this.loading = false;
            }
        },

        async fetchHelper(id) {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.getHelper(id);

                if (response.success) {
                    this.currentHelper = response.data;
                } else {
                    this.error = response.error;
                }
            } catch (error) {
                this.error = error.message;
            } finally {
                this.loading = false;
            }
        },

        async fetchCategories() {
            try {
                const response = await api.getCategories();

                if (response.success) {
                    this.categories = response.data;
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        },

        updateFilters(newFilters) {
            this.filters = { ...this.filters, ...newFilters };
            this.fetchHelpers();
        },

        clearFilters() {
            this.filters = {
                category: "",
                minRate: null,
                maxRate: null,
                minRating: null,
                search: "",
            };
            this.fetchHelpers();
        },
    },
});

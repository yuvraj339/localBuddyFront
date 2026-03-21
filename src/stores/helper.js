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
        // completedJobs: (state) => {
        //     if

        // },
        topRatedHelpers: (state) =>
            [...state.helpers].sort((a, b) => b.rating - a.rating).slice(0, 6),
    },

    actions: {
        // async fetchHelperProfile(userId) {
        //     this.loading = true;
        //     this.error = null;
        //     try {
        //         const response = await api.getHelperProfile(userId);
        //         if (response.success) {
        //             this.currentHelper = response.data;
        //         } else {
        //             this.error = response.error;
        //         }
        //     } catch (error) {
        //         this.error = error.message;
        //     } finally {
        //         this.loading = false;
        //     }
        // },
        async fetchHelpers() {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.getHelpers(this.filters);
                if (response.success) {
                    // Fetch reviews for each helper and compute rating/reviewCount
                    const helpers = response.data;
                    const helpersWithReviews = await Promise.all(
                        helpers.map(async (helper) => {
                            // const reviewsResp = await api.fetchReviews({ helperId: helper.id });
                            let rating = null;
                            let reviewCount = 0;
                            let reviews = [];
                            // if (reviewsResp.success && Array.isArray(reviewsResp.data)) {
                            //     reviews = reviewsResp.data;
                            //     reviewCount = reviews.length;
                            //     if (reviewCount > 0) {
                            //         rating = (
                            //             reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewCount
                            //         ).toFixed(2);
                            //     }
                            // }
                            return { ...helper, rating, reviewCount, reviews };
                        })
                    );
                    this.helpers = helpersWithReviews;
                    localStorage.setItem(
                        "helpers",
                        JSON.stringify(helpersWithReviews)
                    );
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
                if (this.helpers.length === 0) {
                    this.helpers =
                        JSON.parse(localStorage.getItem("helpers")) || [];
                }
                this.currentHelper =
                    this.helpers.find((h) => h.id === id) || null;
                console.log(this.currentHelper);
                // const response = await api.getHelper(id);
                // if (response.success) {
                //     const helper = response.data;
                //     // Fetch reviews for this helper
                //     // const reviewsResp = await api.fetchReviews({
                //     //     helperId: helper.id,
                //     // });
                //     let rating = null;
                //     let reviewCount = 0;
                //     let reviews = [];
                //     // if (
                //     //     reviewsResp.success &&
                //     //     Array.isArray(reviewsResp.data)
                //     // ) {
                //     //     reviews = reviewsResp.data;
                //     //     reviewCount = reviews.length;
                //     //     if (reviewCount > 0) {
                //     //         rating = (
                //     //             reviews.reduce(
                //     //                 (sum, r) => sum + (r.rating || 0),
                //     //                 0,
                //     //             ) / reviewCount
                //     //         ).toFixed(2);
                //     //     }
                //     // }
                //     this.currentHelper = {
                //         ...helper,
                //         rating,
                //         reviewCount,
                //         reviews,
                //     };
                // } else {
                //     this.error = response.error;
                // }
            } catch (error) {
                this.error = error.message;
            } finally {
                this.loading = false;
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

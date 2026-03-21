import { defineStore } from "pinia";
import { api } from "../services/api";

export const useReviewStore = defineStore("review", {
    state: () => ({
        reviews: [],
        showReviewModal: false,
        selectedBooking: null,
        reviewForm: {
            rating: 5,
            comment: "",
        },
    }),
    getters: {
        averageRating: (state) => {
            if (!state.reviews.length) return 0;

            const total = state.reviews.reduce(
                (sum, r) => sum + Number(r.rating),
                0
            );

            return (total / state.reviews.length).toFixed(1);
        },
    },
    actions: {
        openReviewModal(booking) {
            this.selectedBooking = booking;
            this.showReviewModal = true;
        },

        closeReviewModal() {
            this.showReviewModal = false;
            this.selectedBooking = null;
            this.reviewForm.rating = 5;
            this.reviewForm.review = "";
        },

        async fetchBookingReviews(helperId) {
            try {
                const response = await api.fetchReviews(
                    `/reviews/user/${helperId}`
                );
                this.reviews = response.data;
                this.reviews.forEach((review) => {
                    this.rating += parseInt(review.rating);
                });
            } catch (error) {
                console.error("Failed to fetch reviews:", error);
            }
        },
        async fetchReviews(helperId) {
            try {
                const response = await api.fetchReviews(helperId);
                if (response.success) {
                    this.reviews = response.data;
                }
            } catch (error) {
                console.error("Failed to fetch reviews:", error);
            }
        },
        async submitReview(reviewData) {
            try {
                const existingReview = this.reviews.find(
                    (review) => review.booking_id === reviewData.booking_id
                );
                if (existingReview) {
                    const response = await api.updateReview(
                        existingReview.id,
                        reviewData
                    );
                    if (response.success) {
                        this.fetchReviews(reviewData.reviewee_id); // Refresh reviews
                        return true;
                    }
                } else {
                    const response = await api.submitReview(reviewData);
                    if (response.success) {
                        this.fetchReviews(reviewData.reviewee_id); // Refresh reviews
                        return true;
                    }
                }
            } catch (error) {
                console.error("Failed to submit or update review:", error);
            }
            return false;
        },
    },
});

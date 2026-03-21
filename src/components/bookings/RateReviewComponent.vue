<script setup>
import { ref, reactive, onMounted } from "vue";
import { useAuthStore } from "../../stores/auth";
import { useReviewStore } from "../../stores/review";

const props = defineProps({
    helperId: {
        type: String,
        required: true,
    },
});

const authStore = useAuthStore();
const reviewStore = useReviewStore();

onMounted(() => {
    reviewStore.fetchReviews(props.helperId);
});

const submitReview = async () => {
    if (!authStore.isAuthenticated) return;
    if (authStore.user.id === props.helperId) {
        alert("You cannot review yourself.");
        return;
    }
    const reviewData = {
        reviewer_id: authStore.user.id,
        reviewee_id: props.helperId,
        booking_id: reviewStore.selectedBooking.id,
        rating: reviewStore.reviewForm.rating,
        review: reviewStore.reviewForm.comment,
    };

    const success = await reviewStore.submitReview(reviewData);
    if (success) {
        alert("Review submitted successfully!");
        reviewStore.reviewForm.rating = "";
        reviewStore.reviewForm.comment = "";
    } else {
        alert("Failed to submit review.");
    }
    reviewStore.closeReviewModal();
};
</script>

<template>
    <div
        v-if="reviewStore.showReviewModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="reviewStore.closeReviewModal"
    >
        <div class="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 class="text-xl font-semibold mb-4 text-gray-900">
                Rate Your Experience
            </h3>

            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                </label>
                <div class="flex space-x-2">
                    <button
                        v-for="star in 5"
                        :key="star"
                        @click="reviewStore.reviewForm.rating = star"
                        class="text-3xl transition-colors"
                        :class="
                            star <= reviewStore.reviewForm.rating
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                        "
                    >
                        ★
                    </button>
                </div>
            </div>

            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Review
                </label>
                <textarea
                    v-model="reviewStore.reviewForm.comment"
                    rows="4"
                    class="input"
                    placeholder="Share your experience..."
                ></textarea>
            </div>

            <div class="flex space-x-3">
                <button
                    @click="reviewStore.closeReviewModal"
                    class="btn btn-secondary flex-1"
                >
                    Cancel
                </button>
                <button @click="submitReview" class="btn btn-primary flex-1">
                    Submit Review
                </button>
            </div>
        </div>
    </div>
</template>

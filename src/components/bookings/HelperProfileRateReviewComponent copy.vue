<script setup>
import { ref, reactive, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { useReviewStore } from "../stores/review";

const props = defineProps({
    helperId: {
        type: String,
        required: true,
    },
});

const authStore = useAuthStore();
const reviewStore = useReviewStore();

const reviewForm = reactive({
    rating: "",
    comment: "",
});

onMounted(() => {
    alert("Not is use for now");
    reviewStore.fetchReviews(props.helperId);
});

const handleReviewSubmit = async () => {
    if (!authStore.isAuthenticated) return;

    const reviewData = {
        reviewer_id: authStore.user.id,
        reviewee_id: props.helperId,
        booking_id: null, // Adjust if booking_id is required
        rating: reviewForm.rating,
        review: reviewForm.comment,
    };

    const success = await reviewStore.submitReview(reviewData);
    if (success) {
        alert("Review submitted successfully!");
        reviewForm.rating = "";
        reviewForm.comment = "";
    } else {
        alert("Failed to submit review.");
    }
};
</script>

<template>
    <div>
        <h2 class="text-xl font-semibold mb-4 text-gray-900">Rate & Review</h2>
        <form
            v-if="authStore.isAuthenticated"
            @submit.prevent="handleReviewSubmit"
        >
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Rating</label
                >
                <select
                    v-model.number="reviewForm.rating"
                    required
                    class="input"
                >
                    <option disabled value="">Select rating</option>
                    <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
                </select>
            </div>
            <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Comment</label
                >
                <textarea
                    v-model="reviewForm.comment"
                    rows="3"
                    class="input"
                    required
                    placeholder="Share your experience..."
                ></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Submit Review</button>
        </form>
        <div v-else class="text-gray-500">Login to leave a review.</div>

        <div v-if="reviewStore.reviews.length > 0" class="mt-6">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">Reviews</h3>
            <div
                v-for="review in reviewStore.reviews"
                :key="review.id"
                class="mb-4 border-b pb-3"
            >
                <div class="flex items-center mb-1">
                    <span class="text-yellow-400 mr-1">★</span>
                    <span class="font-semibold">{{ review.rating }}</span>
                    <span class="ml-2 text-gray-500 text-xs">{{
                        new Date(review.created_at).toLocaleDateString()
                    }}</span>
                </div>
                <div class="text-gray-800">{{ review.review }}</div>
            </div>
        </div>
        <div v-else class="text-gray-500 mt-6">No reviews yet.</div>
    </div>
</template>

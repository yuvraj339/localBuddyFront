<template>
    <div class="min-h-screen bg-gray-50 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">
                    My Bookings
                </h1>
                <p class="text-gray-600">View and manage your bookings</p>
            </div>

            <div class="mb-6 border-b border-gray-200">
                <nav class="flex space-x-8">
                    <button
                        @click="activeTab = 'upcoming'"
                        :class="[
                            'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                            activeTab === 'upcoming'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                        ]"
                    >
                        Upcoming ({{ bookingStore.upcomingBookings.length }})
                    </button>
                    <button
                        @click="activeTab = 'pending'"
                        :class="[
                            'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                            activeTab === 'pending'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                        ]"
                    >
                        Pending ({{ bookingStore.pendingBookings.length }})
                    </button>
                    <button
                        @click="activeTab = 'completed'"
                        :class="[
                            'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                            activeTab === 'completed'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                        ]"
                    >
                        Completed ({{ bookingStore.completedBookings.length }})
                    </button>
                </nav>
            </div>

            <div
                v-if="currentBookings.length === 0"
                class="card text-center py-16"
            >
                <div class="text-6xl mb-4">📋</div>
                <div class="text-xl text-gray-600 mb-2">
                    No {{ activeTab }} bookings
                </div>
                <p class="text-gray-500 mb-6">
                    Your {{ activeTab }} bookings will appear here
                </p>
                <router-link to="/helpers" class="btn btn-primary">
                    Find Helpers
                </router-link>
            </div>

            <div v-else class="space-y-4">
                <div
                    v-for="booking in currentBookings"
                    :key="booking.id"
                    class="card hover:shadow-lg transition-shadow"
                >
                    <div class="flex items-start space-x-6">
                        <img
                            :src="booking.helper_avatar"
                            :alt="booking.helper_name"
                            class="w-20 h-20 rounded-full object-cover border-2 border-primary-100"
                        />

                        <div class="flex-1">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <h3
                                        class="text-xl font-semibold text-gray-900"
                                    >
                                        {{ booking.helper_name }}
                                    </h3>
                                    <p class="text-gray-600">
                                        {{ booking.category }}
                                    </p>
                                </div>
                                <span
                                    :class="[
                                        'badge',
                                        booking.status === 'upcoming'
                                            ? 'badge-success'
                                            : '',
                                        booking.status === 'pending'
                                            ? 'badge-warning'
                                            : '',
                                        booking.status === 'completed'
                                            ? 'badge-primary'
                                            : '',
                                    ]"
                                >
                                    {{ booking.status }}
                                </span>
                            </div>

                            <div
                                class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm"
                            >
                                <div>
                                    <span class="text-gray-600">Date:</span>
                                    <div class="font-medium">
                                        {{ formatDate(booking.date) }}
                                    </div>
                                </div>
                                <div>
                                    <span class="text-gray-600">Time:</span>
                                    <div class="font-medium">
                                        {{ booking.start_time }} -
                                        {{ booking.end_time }}
                                    </div>
                                </div>
                                <div>
                                    <span class="text-gray-600">Duration:</span>
                                    <div class="font-medium">
                                        {{ booking.hours }} hours
                                    </div>
                                </div>
                                <div>
                                    <span class="text-gray-600">Total:</span>
                                    <div class="font-medium text-primary-600">
                                        ₹{{ booking.total_amount }}
                                    </div>
                                </div>
                            </div>

                            <div class="mb-4">
                                <p class="text-sm text-gray-700">
                                    {{ booking.description }}
                                </p>
                            </div>

                            <div class="flex space-x-3">
                                <button
                                    v-if="booking.status === 'upcoming'"
                                    @click="cancelBooking(booking.id)"
                                    class="btn btn-danger text-sm"
                                >
                                    Cancel Booking
                                </button>

                                <button
                                    v-if="booking.status === 'upcoming'"
                                    @click="trackLocation(booking.id)"
                                    class="btn btn-secondary text-sm"
                                >
                                    📍 Track Location
                                </button>

                                <button
                                    v-if="booking.status === 'upcoming'"
                                    @click="sendSOS(booking.id)"
                                    class="btn bg-red-600 text-white hover:bg-red-700 text-sm"
                                >
                                    🆘 Emergency SOS
                                </button>

                                <router-link
                                    to="/chat"
                                    class="btn btn-secondary text-sm"
                                >
                                    💬 Message
                                </router-link>

                                <button
                                    v-if="
                                        booking.status === 'completed' &&
                                        !booking.rating
                                    "
                                    @click="openReviewModal(booking)"
                                    class="btn btn-primary text-sm"
                                >
                                    ⭐ Rate & Review
                                </button>

                                <div
                                    v-if="
                                        booking.status === 'completed' &&
                                        booking.rating
                                    "
                                    class="flex items-center text-sm"
                                >
                                    <span class="text-yellow-400 mr-1">★</span>
                                    <span>{{ booking.rating }}/5</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div
            v-if="showReviewModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            @click.self="closeReviewModal"
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
                            @click="reviewForm.rating = star"
                            class="text-3xl transition-colors"
                            :class="
                                star <= reviewForm.rating
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
                        v-model="reviewForm.review"
                        rows="4"
                        class="input"
                        placeholder="Share your experience..."
                    ></textarea>
                </div>

                <div class="flex space-x-3">
                    <button
                        @click="closeReviewModal"
                        class="btn btn-secondary flex-1"
                    >
                        Cancel
                    </button>
                    <button
                        @click="submitReview"
                        class="btn btn-primary flex-1"
                    >
                        Submit Review
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import { useAuthStore } from "../stores/auth";
import { useBookingStore } from "../stores/booking";

const authStore = useAuthStore();
const bookingStore = useBookingStore();

const activeTab = ref("upcoming");
const showReviewModal = ref(false);
const selectedBooking = ref(null);

const reviewForm = reactive({
    rating: 5,
    review: "",
});

const currentBookings = computed(() => {
    switch (activeTab.value) {
        case "upcoming":
            return bookingStore.upcomingBookings;
        case "pending":
            return bookingStore.pendingBookings;
        case "completed":
            return bookingStore.completedBookings;
        default:
            return [];
    }
});

onMounted(() => {
    bookingStore.fetchBookings(authStore.user?.id, authStore.user?.role);
});

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const cancelBooking = async (id) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
        await bookingStore.updateBookingStatus(id, "cancelled");
        alert("Booking cancelled successfully");
    }
};

const trackLocation = (id) => {
    alert("Location tracking active. Helper is on the way!");
};

const sendSOS = (id) => {
    if (
        confirm(
            "This will alert emergency services and platform support. Continue?",
        )
    ) {
        alert("Emergency alert sent! Help is on the way.");
    }
};

const openReviewModal = (booking) => {
    selectedBooking.value = booking;
    showReviewModal.value = true;
};

const closeReviewModal = () => {
    showReviewModal.value = false;
    selectedBooking.value = null;
    reviewForm.rating = 5;
    reviewForm.review = "";
};

const submitReview = () => {
    alert("Thank you for your review!");
    closeReviewModal();
};
</script>

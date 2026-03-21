<template>
    <div class="min-h-screen bg-gray-50 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">
                    My Bookings
                </h1>
                <p class="text-gray-600">View and manage your bookings</p>
            </div>
            <TabsComponent
                :activeTab="activeTab"
                @update:activeTab="activeTab = $event"
            />
            <div
                v-if="currentBookings && currentBookings.length === 0"
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
                            :src="avatarSrc(booking.customer_avatar_url)"
                            :alt="booking.customer_name"
                            class="w-20 h-20 rounded-full object-cover border-2 border-primary-100"
                        />

                        <div class="flex-1">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <h3
                                        class="text-xl font-semibold text-gray-900"
                                    >
                                        {{ booking.customer_name }}
                                    </h3>
                                    <p class="text-gray-600">
                                        {{ booking.category }}
                                    </p>
                                </div>
                                <span
                                    class="capitalize"
                                    :class="[
                                        'badge',
                                        [
                                            'upcoming',
                                            'accepted',
                                            'in_progress',
                                        ].includes(booking.status)
                                            ? 'badge-success'
                                            : '',
                                        booking.status === 'pending'
                                            ? 'badge-warning'
                                            : '',
                                        ['completed'].includes(booking.status)
                                            ? 'badge-primary'
                                            : '',
                                        [
                                            'rejected',
                                            'cancelled',
                                            'disputed',
                                        ].includes(booking.status)
                                            ? 'badge-danger'
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
                                    @click="
                                        updateBookingStatus(
                                            booking.id,
                                            'cancelled'
                                        )
                                    "
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
                                <button
                                    type="button"
                                    @click="
                                        $router.push(
                                            `/chat?helper=${booking.customer_id}`
                                        )
                                    "
                                    class="btn btn-secondary text-sm"
                                >
                                    💬 Message
                                </button>
                                <select
                                    v-if="
                                        ![
                                            'rejected',
                                            'completed',
                                            'cancelled',
                                            'disputed',
                                        ].includes(booking.status)
                                    "
                                    class="btn btn-outline text-sm capitalize border border-gray-200"
                                    :value="booking.status"
                                    @change="
                                        updateBookingStatus(
                                            booking.id,
                                            $event.target.value
                                        )
                                    "
                                >
                                    <option disabled value="">
                                        Update Status
                                    </option>
                                    <option
                                        disabled
                                        value=""
                                        v-if="authStore.hasRole('customer')"
                                    >
                                        {{ booking.status }}
                                    </option>
                                    <option
                                        v-for="status in bookingStatusList"
                                        :key="status"
                                        :value="status"
                                    >
                                        {{ status.replace("_", " ") }}
                                    </option>
                                </select>
                                <button
                                    v-if="postReview(postReview)"
                                    @click="
                                        reviewStore.openReviewModal(booking)
                                    "
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
        {{ reviewStore.selectedBooking }}
        <div
            class="card mt-6"
            v-if="
                reviewStore.selectedBooking &&
                reviewStore.selectedBooking.helper_id
            "
        >
            <RateReviewComponent
                :helperId="reviewStore.selectedBooking.helper_id"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { useBookingStore } from "../stores/booking";
import { useReviewStore } from "../stores/review";
import { avatarSrc } from "../utils/util";
import TabsComponent from "../components/bookings/TabsComponent.vue";
import RateReviewComponent from "../components/bookings/RateReviewComponent.vue";

const authStore = useAuthStore();
const bookingStore = useBookingStore();
const reviewStore = useReviewStore();

const activeTab = ref("upcoming");

const bookingStatusList = computed(() => {
    debugger;
    let IsCustomer = authStore.hasRole("customer");
    if (IsCustomer) {
        return ["cancelled", "disputed"];
    } else
        return [
            "pending",
            "accepted",
            "rejected",
            "in_progress",
            "completed",
            "cancelled",
            "disputed",
        ];
});

const currentBookings = computed(() => {
    return bookingStore.getBookings(activeTab.value);
});

onMounted(() => {
    bookingStore.fetchBookings(authStore.user?.id, authStore.user?.role);
});
const postReview = (booking) => {
    return (
        authStore.hasRole("customer") &&
        booking.status === "completed" &&
        !booking.rating
    );
};
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const updateBookingStatus = async (id, status) => {
    if (confirm(`Are you sure you want to ${status} this booking?`)) {
        await bookingStore.updateBookingStatus(id, status);
        alert(`Booking ${status} successfully`);
    }
};

const trackLocation = (id) => {
    alert("Location tracking active. Helper is on the way!");
};

const sendSOS = (id) => {
    if (
        confirm(
            "This will alert emergency services and platform support. Continue?"
        )
    ) {
        alert("Emergency alert sent! Help is on the way.");
    }
};
</script>

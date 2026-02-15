<template>
    <div class="min-h-screen bg-gray-50 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">
                    Welcome back, {{ authStore.user?.name }}
                </h1>
                <p class="text-gray-600">
                    Manage your bookings and find helpers
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div
                    class="card bg-gradient-to-br from-blue-500 to-cyan-500 text-white"
                >
                    <div class="text-sm font-medium mb-2">Active Bookings</div>
                    <div class="text-3xl font-bold">
                        {{ bookingStore.upcomingBookings.length }}
                    </div>
                </div>
                <div
                    class="card bg-gradient-to-br from-green-500 to-emerald-500 text-white"
                >
                    <div class="text-sm font-medium mb-2">Completed</div>
                    <div class="text-3xl font-bold">
                        {{ bookingStore.completedBookings.length }}
                    </div>
                </div>
                <div
                    class="card bg-gradient-to-br from-orange-500 to-amber-500 text-white"
                >
                    <div class="text-sm font-medium mb-2">Pending Requests</div>
                    <div class="text-3xl font-bold">
                        {{ bookingStore.pendingBookings.length }}
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-semibold text-gray-900">
                            Upcoming Bookings
                        </h2>
                        <router-link
                            to="/bookings"
                            class="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                            View All
                        </router-link>
                    </div>

                    <div
                        v-if="bookingStore.upcomingBookings.length === 0"
                        class="card text-center py-12"
                    >
                        <div class="text-6xl mb-4">📅</div>
                        <div class="text-gray-600 mb-4">
                            No upcoming bookings
                        </div>
                        <router-link to="/helpers" class="btn btn-primary">
                            Find Helpers
                        </router-link>
                    </div>

                    <div v-else class="space-y-4">
                        <div
                            v-for="booking in bookingStore.upcomingBookings.slice(
                                0,
                                3
                            )"
                            :key="booking.id"
                            class="card hover:shadow-lg transition-shadow"
                        >
                            <div class="flex items-start space-x-4">
                                <img
                                    :src="booking.helperAvatar"
                                    :alt="booking.helperName"
                                    class="w-16 h-16 rounded-full object-cover"
                                />
                                <div class="flex-1">
                                    <div
                                        class="flex justify-between items-start"
                                    >
                                        <div>
                                            <h3
                                                class="font-semibold text-gray-900"
                                            >
                                                {{ booking.helperName }}
                                            </h3>
                                            <p class="text-sm text-gray-600">
                                                {{ booking.category }}
                                            </p>
                                        </div>
                                        <span class="badge badge-success">{{
                                            booking.status
                                        }}</span>
                                    </div>
                                    <div class="mt-2 text-sm text-gray-600">
                                        <div>
                                            📅 {{ formatDate(booking.date) }}
                                        </div>
                                        <div>⏰ {{ booking.timeSlot }}</div>
                                        <div
                                            class="font-semibold text-primary-600 mt-1"
                                        >
                                            ₹{{ booking.total }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-semibold text-gray-900">
                            Quick Actions
                        </h2>
                    </div>

                    <div class="space-y-4">
                        <router-link
                            to="/helpers"
                            class="card hover:shadow-lg transition-shadow flex items-center justify-between cursor-pointer"
                        >
                            <div class="flex items-center space-x-4">
                                <div
                                    class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-2xl"
                                >
                                    🔍
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-900">
                                        Find Helpers
                                    </h3>
                                    <p class="text-sm text-gray-600">
                                        Browse available helpers
                                    </p>
                                </div>
                            </div>
                            <span class="text-gray-400">→</span>
                        </router-link>

                        <router-link
                            to="/bookings"
                            class="card hover:shadow-lg transition-shadow flex items-center justify-between cursor-pointer"
                        >
                            <div class="flex items-center space-x-4">
                                <div
                                    class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl"
                                >
                                    📋
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-900">
                                        My Bookings
                                    </h3>
                                    <p class="text-sm text-gray-600">
                                        View all your bookings
                                    </p>
                                </div>
                            </div>
                            <span class="text-gray-400">→</span>
                        </router-link>

                        <router-link
                            to="/chat"
                            class="card hover:shadow-lg transition-shadow flex items-center justify-between cursor-pointer"
                        >
                            <div class="flex items-center space-x-4">
                                <div
                                    class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl"
                                >
                                    💬
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-900">
                                        Messages
                                    </h3>
                                    <p class="text-sm text-gray-600">
                                        Chat with helpers
                                    </p>
                                </div>
                            </div>
                            <span class="text-gray-400">→</span>
                        </router-link>

                        <router-link
                            to="/profile"
                            class="card hover:shadow-lg transition-shadow flex items-center justify-between cursor-pointer"
                        >
                            <div class="flex items-center space-x-4">
                                <div
                                    class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl"
                                >
                                    👤
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-900">
                                        My Profile
                                    </h3>
                                    <p class="text-sm text-gray-600">
                                        Update your information
                                    </p>
                                </div>
                            </div>
                            <span class="text-gray-400">→</span>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { useBookingStore } from "../stores/booking";

const authStore = useAuthStore();
const bookingStore = useBookingStore();

onMounted(() => {
    bookingStore.fetchBookings(authStore.user?.id, "customer");
});

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};
</script>

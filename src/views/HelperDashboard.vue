<template>
    <div class="min-h-screen bg-gray-50 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">
                    Helper Dashboard
                </h1>
                <p class="text-gray-600">
                    Manage your availability and earnings
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div
                    class="card bg-gradient-to-br from-blue-500 to-cyan-500 text-white"
                >
                    <div class="text-sm font-medium mb-2">Total Earnings</div>
                    <div class="text-3xl font-bold">
                        ₹{{ helperProfile.earnings.total.toLocaleString() }}
                    </div>
                </div>
                <div
                    class="card bg-gradient-to-br from-green-500 to-emerald-500 text-white"
                >
                    <div class="text-sm font-medium mb-2">This Month</div>
                    <div class="text-3xl font-bold">
                        ₹{{ helperProfile.earnings.thisMonth.toLocaleString() }}
                    </div>
                </div>
                <div
                    class="card bg-gradient-to-br from-orange-500 to-amber-500 text-white"
                >
                    <div class="text-sm font-medium mb-2">Completed Jobs</div>
                    <div class="text-3xl font-bold">
                        {{ helperProfile.completedJobs }}
                    </div>
                </div>
                <div
                    class="card bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                >
                    <div class="text-sm font-medium mb-2">Rating</div>
                    <div class="text-3xl font-bold">
                        {{ helperProfile.rating }} ⭐
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 space-y-6">
                    <div class="card">
                        <h2 class="text-xl font-semibold mb-4 text-gray-900">
                            Booking Requests
                        </h2>

                        <div
                            v-if="bookingStore.pendingBookings.length === 0"
                            class="text-center py-8"
                        >
                            <div class="text-6xl mb-4">📭</div>
                            <div class="text-gray-600">No pending requests</div>
                        </div>

                        <div v-else class="space-y-4">
                            <div
                                v-for="booking in bookingStore.pendingBookings"
                                :key="booking.id"
                                class="border border-gray-200 rounded-lg p-4"
                            >
                                <div
                                    class="flex justify-between items-start mb-4"
                                >
                                    <div>
                                        <h3 class="font-semibold text-gray-900">
                                            {{ booking.category }}
                                        </h3>
                                        <p class="text-sm text-gray-600">
                                            {{ booking.location }}
                                        </p>
                                    </div>
                                    <span class="badge badge-warning"
                                        >Pending</span
                                    >
                                </div>

                                <div
                                    class="grid grid-cols-2 gap-4 mb-4 text-sm"
                                >
                                    <div>
                                        <span class="text-gray-600">Date:</span>
                                        <span class="ml-2 font-medium">{{
                                            formatDate(booking.date)
                                        }}</span>
                                    </div>
                                    <div>
                                        <span class="text-gray-600">Time:</span>
                                        <span class="ml-2 font-medium">{{
                                            booking.timeSlot
                                        }}</span>
                                    </div>
                                    <div>
                                        <span class="text-gray-600"
                                            >Duration:</span
                                        >
                                        <span class="ml-2 font-medium"
                                            >{{ booking.hours }} hours</span
                                        >
                                    </div>
                                    <div>
                                        <span class="text-gray-600"
                                            >Amount:</span
                                        >
                                        <span
                                            class="ml-2 font-medium text-primary-600"
                                            >₹{{ booking.total }}</span
                                        >
                                    </div>
                                </div>

                                <p class="text-sm text-gray-700 mb-4">
                                    {{ booking.description }}
                                </p>

                                <div class="flex space-x-3">
                                    <button
                                        @click="acceptBooking(booking.id)"
                                        class="btn btn-success flex-1"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        @click="rejectBooking(booking.id)"
                                        class="btn btn-danger flex-1"
                                    >
                                        Decline
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <h2 class="text-xl font-semibold mb-4 text-gray-900">
                            Upcoming Jobs
                        </h2>

                        <div
                            v-if="bookingStore.upcomingBookings.length === 0"
                            class="text-center py-8"
                        >
                            <div class="text-6xl mb-4">📅</div>
                            <div class="text-gray-600">No upcoming jobs</div>
                        </div>

                        <div v-else class="space-y-4">
                            <div
                                v-for="booking in bookingStore.upcomingBookings"
                                :key="booking.id"
                                class="border border-gray-200 rounded-lg p-4"
                            >
                                <div
                                    class="flex justify-between items-start mb-2"
                                >
                                    <div>
                                        <h3 class="font-semibold text-gray-900">
                                            {{ booking.category }}
                                        </h3>
                                        <p class="text-sm text-gray-600">
                                            {{ booking.location }}
                                        </p>
                                    </div>
                                    <span class="badge badge-success"
                                        >Confirmed</span
                                    >
                                </div>

                                <div
                                    class="text-sm text-gray-600 space-y-1 mb-4"
                                >
                                    <div>📅 {{ formatDate(booking.date) }}</div>
                                    <div>⏰ {{ booking.timeSlot }}</div>
                                    <div class="font-semibold text-primary-600">
                                        ₹{{ booking.total }}
                                    </div>
                                </div>

                                <button
                                    @click="startJob(booking.id)"
                                    class="btn btn-primary w-full"
                                >
                                    Start Job
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="space-y-6">
                    <div class="card">
                        <h3 class="text-lg font-semibold mb-4 text-gray-900">
                            Profile Status
                        </h3>

                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <span class="text-gray-700">Verification</span>
                                <span class="badge badge-success"
                                    >Verified</span
                                >
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-gray-700">Profile</span>
                                <span class="badge badge-success"
                                    >Complete</span
                                >
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-gray-700">Documents</span>
                                <span class="badge badge-success"
                                    >Approved</span
                                >
                            </div>
                        </div>

                        <router-link
                            to="/profile"
                            class="btn btn-secondary w-full mt-4"
                        >
                            Edit Profile
                        </router-link>
                    </div>

                    <div class="card">
                        <h3 class="text-lg font-semibold mb-4 text-gray-900">
                            Availability
                        </h3>

                        <div class="space-y-2 mb-4">
                            <div
                                v-for="day in daysOfWeek"
                                :key="day"
                                class="flex items-center justify-between"
                            >
                                <span class="text-sm text-gray-700">{{
                                    day
                                }}</span>
                                <input
                                    type="checkbox"
                                    :checked="
                                        helperProfile.availability.includes(day)
                                    "
                                    @change="toggleAvailability(day)"
                                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                            </div>
                        </div>

                        <button class="btn btn-primary w-full">
                            Update Availability
                        </button>
                    </div>

                    <div class="card">
                        <h3 class="text-lg font-semibold mb-4 text-gray-900">
                            Hourly Rate
                        </h3>

                        <div class="mb-4">
                            <input
                                v-model="helperProfile.hourlyRate"
                                type="number"
                                class="input"
                                min="100"
                            />
                        </div>

                        <button class="btn btn-primary w-full">
                            Update Rate
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useBookingStore } from "../stores/booking";
import { mockHelperProfile } from "../services/mockData";

const bookingStore = useBookingStore();
const helperProfile = ref(mockHelperProfile);

const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

onMounted(() => {
    bookingStore.fetchBookings(helperProfile.value.id, "helper");
});

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const acceptBooking = async (id) => {
    await bookingStore.updateBookingStatus(id, "upcoming");
    alert("Booking accepted!");
};

const rejectBooking = async (id) => {
    await bookingStore.updateBookingStatus(id, "rejected");
    alert("Booking declined");
};

const startJob = (id) => {
    alert("Job started! Location tracking enabled.");
};

const toggleAvailability = (day) => {
    const index = helperProfile.value.availability.indexOf(day);
    if (index > -1) {
        helperProfile.value.availability.splice(index, 1);
    } else {
        helperProfile.value.availability.push(day);
    }
};
</script>

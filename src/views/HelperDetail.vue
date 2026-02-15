<template>
    <div class="min-h-screen bg-gray-50 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div v-if="helperStore.loading" class="text-center py-12">
                <div class="text-lg text-gray-600">Loading...</div>
            </div>

            <div
                v-else-if="helper"
                class="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
                <div class="lg:col-span-2 space-y-6">
                    <div class="card">
                        <div class="flex items-start space-x-6">
                            <img
                                :src="helper.avatar"
                                :alt="helper.name"
                                class="w-32 h-32 rounded-full object-cover border-4 border-primary-100"
                            />
                            <div class="flex-1">
                                <div class="flex items-center mb-2">
                                    <h1
                                        class="text-3xl font-bold text-gray-900"
                                    >
                                        {{ helper.name }}
                                    </h1>
                                    <span
                                        v-if="helper.verified"
                                        class="ml-3 text-blue-500 text-2xl"
                                        title="Verified"
                                    >
                                        ✓
                                    </span>
                                </div>
                                <div
                                    class="flex items-center text-gray-600 mb-4"
                                >
                                    <span class="text-yellow-400 text-xl mr-2"
                                        >★</span
                                    >
                                    <span class="font-semibold text-lg">{{
                                        helper.rating
                                    }}</span>
                                    <span class="ml-2"
                                        >({{
                                            helper.reviewCount
                                        }}
                                        reviews)</span
                                    >
                                    <span class="mx-3">•</span>
                                    <span
                                        >{{ helper.completedJobs }} jobs
                                        completed</span
                                    >
                                </div>
                                <div
                                    class="flex items-center space-x-4 text-sm text-gray-600"
                                >
                                    <span>📍 {{ helper.location }}</span>
                                    <span
                                        >⚡ Responds in
                                        {{ helper.responseTime }}</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <h2 class="text-xl font-semibold mb-4 text-gray-900">
                            About
                        </h2>
                        <p class="text-gray-700 leading-relaxed">
                            {{ helper.bio }}
                        </p>
                    </div>

                    <div class="card">
                        <h2 class="text-xl font-semibold mb-4 text-gray-900">
                            Services
                        </h2>
                        <div class="flex flex-wrap gap-2">
                            <span
                                v-for="category in helper.categories"
                                :key="category"
                                class="badge badge-primary"
                            >
                                {{ category }}
                            </span>
                        </div>
                    </div>

                    <div class="card">
                        <h2 class="text-xl font-semibold mb-4 text-gray-900">
                            Skills
                        </h2>
                        <div class="flex flex-wrap gap-2">
                            <span
                                v-for="skill in helper.skills"
                                :key="skill"
                                class="badge bg-gray-100 text-gray-700"
                            >
                                {{ skill }}
                            </span>
                        </div>
                    </div>

                    <div class="card">
                        <h2 class="text-xl font-semibold mb-4 text-gray-900">
                            Availability
                        </h2>
                        <div class="grid grid-cols-7 gap-2">
                            <div
                                v-for="day in daysOfWeek"
                                :key="day"
                                :class="[
                                    'text-center p-3 rounded-lg border-2',
                                    helper.availability.includes(day)
                                        ? 'bg-success-50 border-success-500 text-success-700'
                                        : 'bg-gray-50 border-gray-200 text-gray-400',
                                ]"
                            >
                                <div class="text-xs font-medium">
                                    {{ day.substring(0, 3) }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-1">
                    <div class="card sticky top-20">
                        <div class="text-center mb-6">
                            <div
                                class="text-4xl font-bold text-primary-600 mb-2"
                            >
                                ₹{{ helper.hourlyRate }}
                            </div>
                            <div class="text-gray-600">per hour</div>
                        </div>

                        <form @submit.prevent="handleBooking" class="space-y-4">
                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Date
                                </label>
                                <input
                                    v-model="bookingForm.date"
                                    type="date"
                                    required
                                    class="input"
                                    :min="minDate"
                                />
                            </div>

                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Start Time
                                </label>
                                <input
                                    v-model="bookingForm.startTime"
                                    type="time"
                                    required
                                    class="input"
                                />
                            </div>

                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Duration (hours)
                                </label>
                                <input
                                    v-model.number="bookingForm.hours"
                                    type="number"
                                    min="1"
                                    required
                                    class="input"
                                />
                            </div>

                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Category
                                </label>
                                <select
                                    v-model="bookingForm.category"
                                    required
                                    class="input"
                                >
                                    <option value="">Select a service</option>
                                    <option
                                        v-for="category in helper.categories"
                                        :key="category"
                                        :value="category"
                                    >
                                        {{ category }}
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Description
                                </label>
                                <textarea
                                    v-model="bookingForm.description"
                                    rows="3"
                                    class="input"
                                    placeholder="Describe your requirements..."
                                ></textarea>
                            </div>

                            <div class="border-t pt-4">
                                <div class="flex justify-between mb-2">
                                    <span class="text-gray-600">Rate:</span>
                                    <span class="font-medium"
                                        >₹{{ helper.hourlyRate }}/hour</span
                                    >
                                </div>
                                <div class="flex justify-between mb-2">
                                    <span class="text-gray-600">Hours:</span>
                                    <span class="font-medium">{{
                                        bookingForm.hours
                                    }}</span>
                                </div>
                                <div
                                    class="flex justify-between text-lg font-bold"
                                >
                                    <span>Total:</span>
                                    <span class="text-primary-600"
                                        >₹{{ totalAmount }}</span
                                    >
                                </div>
                            </div>

                            <button
                                type="submit"
                                class="btn btn-primary w-full py-3"
                                :disabled="!authStore.isAuthenticated"
                            >
                                {{
                                    authStore.isAuthenticated
                                        ? "Book Now"
                                        : "Login to Book"
                                }}
                            </button>

                            <button
                                v-if="authStore.isAuthenticated"
                                type="button"
                                @click="$router.push('/chat')"
                                class="btn btn-secondary w-full"
                            >
                                Message Helper
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useHelperStore } from "../stores/helper";
import { useBookingStore } from "../stores/booking";
import { useAuthStore } from "../stores/auth";

const route = useRoute();
const router = useRouter();
const helperStore = useHelperStore();
const bookingStore = useBookingStore();
const authStore = useAuthStore();

const helper = computed(() => helperStore.currentHelper);

const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

const minDate = computed(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
});

const bookingForm = reactive({
    date: "",
    startTime: "",
    hours: 2,
    category: "",
    description: "",
});

const totalAmount = computed(() => {
    return helper.value ? helper.value.hourlyRate * bookingForm.hours : 0;
});

onMounted(() => {
    helperStore.fetchHelper(route.params.id);
});

const handleBooking = async () => {
    if (!authStore.isAuthenticated) {
        router.push("/login");
        return;
    }

    const bookingData = {
        helperId: helper.value.id,
        helperName: helper.value.name,
        helperAvatar: helper.value.avatar,
        date: bookingForm.date,
        timeSlot: `${bookingForm.startTime} - ${calculateEndTime()}`,
        hours: bookingForm.hours,
        rate: helper.value.hourlyRate,
        total: totalAmount.value,
        category: bookingForm.category,
        description: bookingForm.description,
        location: "",
    };

    const booking = await bookingStore.createBooking(bookingData);

    if (booking) {
        alert("Booking request sent successfully!");
        router.push("/bookings");
    }
};

const calculateEndTime = () => {
    const [hours, minutes] = bookingForm.startTime.split(":");
    const endHour = parseInt(hours) + bookingForm.hours;
    return `${endHour.toString().padStart(2, "0")}:${minutes}`;
};
</script>

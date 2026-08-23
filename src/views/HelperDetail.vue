<template>
    <div class="min-h-screen bg-gray-50 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div v-if="helperStore.loading" class="text-center py-12">
                <div class="text-lg text-gray-600">Loading...</div>
            </div>

            <div v-else-if="helper" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 space-y-6">
                    <div class="card">
                        <div class="flex items-start space-x-6">
                            <img :src="helperAvatarSrc(helper.avatar)" :alt="helper.name"
                                class="w-32 h-32 rounded-full object-cover border-4 border-primary-100" />
                            <div class="flex-1">
                                <div class="flex items-center mb-2">
                                    <h1 class="text-3xl font-bold text-gray-900">
                                        {{ helper.name }}
                                    </h1>
                                    <span v-if="helper.verified" class="ml-3 text-blue-500 text-2xl" title="Verified">
                                        ✓
                                    </span>
                                </div>
                                <div class="flex items-center text-gray-600 mb-4">
                                    <span class="text-yellow-400 text-xl mr-2">★</span>
                                    <span class="font-semibold text-lg">{{
                                        reviewStore.averageRating ?? "N/A"
                                    }}</span>
                                    <span class="ml-2">
                                        ({{ reviewStore.reviews.length ?? 0 }}
                                        reviews)
                                    </span>
                                    <span class="mx-3">•</span>
                                    <span>{{ helper.completedJobs }} jobs
                                        completed</span>
                                </div>

                                <div class="flex items-center space-x-4 text-sm text-gray-600">
                                    <span>📍 {{ helper.location }}</span>
                                    <span>⚡ Responds in
                                        {{ helper.responseTime }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <h2 class="text-xl font-semibold mb-4 text-gray-900">
                            Reviews
                        </h2>
                        <div v-if="
                            reviewStore.reviews &&
                            reviewStore.reviews.length > 0
                        ">
                            <div v-for="review in reviewStore.reviews" :key="review.id" class="mb-4 border-b pb-3">
                                <div class="items-center mb-1 flex justify-between">
                                    <div>
                                        <span class="mr-1" :class="[
                                            review.rating < 3
                                                ? 'text-red-500'
                                                : 'text-green-500',
                                        ]" v-for="value in review.rating">★</span>
                                    </div>
                                    <!-- <span class="font-semibold"></span> -->
                                    <span class="ml-2 text-gray-500 text-xs float-end">{{
                                        new Date(
                                            review.created_at
                                        ).toLocaleDateString()
                                    }}</span>
                                </div>
                                <div class="text-gray-800 capitalize">
                                    {{ review.review }}
                                </div>
                                <div class="text-xs text-gray-500 mt-1">
                                    By
                                    {{ review.user_name || "User" }}
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-gray-500">No reviews yet.</div>
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
                            <span v-for="category in helper.categories" :key="category" class="badge badge-primary">
                                {{ category }}
                            </span>
                        </div>
                    </div>

                    <div class="card">
                        <h2 class="text-xl font-semibold mb-4 text-gray-900">
                            Skills
                        </h2>
                        <div class="flex flex-wrap gap-2">
                            <span v-for="skill in helper.skills" :key="skill" class="badge bg-gray-100 text-gray-700">
                                {{ skill }}
                            </span>
                        </div>
                    </div>

                    <div class="card">
                        <h2 class="text-xl font-semibold mb-4 text-gray-900">
                            Availability
                        </h2>
                        <div class="grid grid-cols-7 gap-2">
                            <div v-for="day in daysOfWeek" :key="day" :class="[
                                'text-center p-3 rounded-lg border-2',
                                helper.availability.includes(day)
                                    ? 'bg-success-50 border-success-500 text-success-700'
                                    : 'bg-gray-50 border-gray-200 text-gray-400',
                            ]">
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
                            <div class="text-4xl font-bold text-primary-600 mb-2">
                                ₹{{ helper.hourlyRate }}
                            </div>
                            <div class="text-gray-600">per hour</div>
                        </div>

                        <form @submit.prevent="handleBooking" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2" for="date">
                                    Date <span class="text-red-500">*</span>
                                    <VueDatePicker required auto-apply v-model="bookingForm.date" :min-date="new Date()"
                                        :disabled-dates="disableUnavailableDates
                                            " :formats="{
                                                input: 'yyyy-MM-dd',
                                                preview: 'yyyy-MM-dd',
                                            }" timezone="utc" />
                                </label>
                                <span class="text-red-500" v-if="error.dateErr">Date is required</span>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Start Time
                                    <span class="text-red-500">*</span>
                                </label>
                                <VueDatePicker required v-model="bookingForm.startTime" time-picker
                                    :disabled-times="bookedSlots" />
                                <span class="text-red-500" v-if="error.startTimeErr">Start time is required</span>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Duration (hours)
                                </label>
                                <input v-model.number="bookingForm.hours" type="number" min="1" required
                                    class="input" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Category <span class="text-red-500">*</span>
                                </label>
                                <select v-model="bookingForm.category" required class="input">
                                    <option value="">Select a service</option>
                                    <option v-for="category in helper.categories" :key="category" :value="category">
                                        {{ category }}
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea v-model="bookingForm.description" rows="3" class="input"
                                    placeholder="Describe your requirements..."></textarea>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Payment plan</label>
                                <select v-model="bookingForm.paymentPlan" class="input">
                                    <option value="full_online">Pay fully online</option>
                                    <option value="half_online_half_cash">Pay 50% online, 50% cash</option>
                                    <option value="full_cash">Pay fully in cash after service</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Coupon code</label>
                                <div class="flex gap-2"><input v-model.trim="bookingForm.couponCode" class="input min-w-0" placeholder="Enter coupon" /><button type="button" class="btn btn-secondary shrink-0" @click="loadQuote">Apply</button></div>
                                <p v-if="quoteError" class="mt-1 text-sm text-red-600">{{ quoteError }}</p>
                            </div>

                            <div class="border-t pt-4">
                                <div class="flex justify-between mb-2">
                                    <span class="text-gray-600">Rate:</span>
                                    <span class="font-medium">₹{{ helper.hourlyRate }}/hour</span>
                                </div>
                                <div class="flex justify-between mb-2">
                                    <span class="text-gray-600">Hours:</span>
                                    <span class="font-medium">{{
                                        bookingForm.hours
                                    }}</span>
                                </div>
                                <template v-if="checkoutQuote">
                                    <div class="flex justify-between mb-2"><span class="text-gray-600">Discount:</span><span>-₹{{ checkoutQuote.discount_amount }}</span></div>
                                    <div class="flex justify-between mb-2"><span class="text-gray-600">Platform fee + GST:</span><span>₹{{ Number(checkoutQuote.customer_fee) + Number(checkoutQuote.gst_amount) }}</span></div>
                                    <div class="flex justify-between mb-2"><span class="text-gray-600">Pay online / cash:</span><span>₹{{ checkoutQuote.online_amount }} / ₹{{ checkoutQuote.cash_amount }}</span></div>
                                </template>
                                <div class="flex justify-between text-lg font-bold">
                                    <span>Total:</span>
                                    <span class="text-primary-600">₹{{ checkoutQuote?.total_customer_amount || totalAmount }}</span>
                                </div>
                            </div>
                            <div v-if="!helper.isAvailable">
                                <button type="button" class="btn btn-secondary w-full cursor-not-allowed">
                                    Not Available
                                </button>
                            </div>
                            <div v-else>
                                <button :type="authStore.isAuthenticated ? 'submit' : 'button'" @click="handleBookClick"
                                    class="btn btn-primary w-full py-3 mb-3">
                                    {{
                                        authStore.isAuthenticated
                                            ? "Book Now"
                                            : "Login to Book"
                                    }}
                                </button>

                                <button v-if="authStore.isAuthenticated" type="button" @click="
                                    $router.push(
                                        `/chat?helper=${helper.id}`
                                    )
                                    " class="btn btn-secondary w-full">
                                    Message Helper
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <!-- <div class="card mt-6" v-if="helper && helper.id">
                <HelperProfileRateReviewComponent :helperId="helper.id" />
            </div> -->
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from "vue";
import { api } from "../services/api";
import { useRoute, useRouter } from "vue-router";
import { useHelperStore } from "../stores/helper";
import { useBookingStore } from "../stores/booking";
import { usePaymentStore } from "../stores/payment";
import { useAuthStore } from "../stores/auth";
import { useReviewStore } from "../stores/review";
import { helperAvatarSrc } from "../utils/util";

const route = useRoute();
const router = useRouter();

const handleBookClick = () => {
    if (!authStore.isAuthenticated) {
        router.push({
            path: "/login",
            query: { redirect: route.fullPath },
        });
    }
    // if authenticated, type="submit" lets the form submit normally
};
const helperStore = useHelperStore();
const bookingStore = useBookingStore();
const authStore = useAuthStore();
const payment = usePaymentStore();

const helper = computed(() => helperStore.currentHelper);
const reviewStore = useReviewStore();
const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

// const availableDays = ["2023-10-10", "2023-10-15", "2023-10-20"]; // Example available dates

// const formatDate = (date) => {
//     const d = new Date(date);
//     const year = d.getFullYear();
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const day = String(d.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
// };

// const isDateAvailable = (date) => {
//     if (!date) return true;
//     debugger;
//     const dayIndex = new Date(date).getDay();
//     return availableDates.value.includes(dayIndex);
// };

// const isDateAvailable = (date) => {
//     const formattedDate = formatDate(date);
//     return availableDays.includes(formattedDate);
// };
// const disabledDates = [
//     new Date(),
//     addDays(new Date(), 1),
//     addDays(new Date(), 2),
// ];
const disableUnavailableDates = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for comparison
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    // Disable past dates
    // if (selectedDate < today) {
    //     return true;
    // }

    // Enable only dates matching helper's availability
    const dayOfWeek = daysOfWeek[selectedDate.getDay()];
    return helper.value.availability.includes(dayOfWeek);
};

// const minDate = computed(() => {
//     const tomorrow = new Date();
//     tomorrow.setDate(tomorrow.getDate() + 1);
//     return tomorrow.toISOString().split("T")[0];
// });
const error = reactive({
    dateErr: false,
    startTimeErr: false,
});
const bookingForm = reactive({
    date: "",
    startTime: "",
    hours: 2,
    category: "",
    description: "",
    paymentPlan: "full_online",
    couponCode: "",
});
const checkoutQuote = ref(null);
const quoteError = ref("");

const totalAmount = computed(() => {
    return helper.value ? helper.value.hourlyRate * bookingForm.hours : 0;
});
const loadQuote = async () => {
    if (!authStore.isAuthenticated || !helper.value?.id || !bookingForm.category) return;
    quoteError.value = "";
    const response = await api.getCheckoutQuote({ helper_id: helper.value.id, category: bookingForm.category, service_amount: totalAmount.value, coupon_code: bookingForm.couponCode || null, payment_plan: bookingForm.paymentPlan });
    if (response.success) checkoutQuote.value = response.data;
    else { checkoutQuote.value = null; quoteError.value = response.error; }
};
watch(() => [bookingForm.hours, bookingForm.category, bookingForm.paymentPlan], loadQuote);
const loadRazorpay = () => new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const script = document.createElement("script"); script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = resolve; script.onerror = () => reject(new Error("Unable to load Razorpay checkout")); document.head.appendChild(script);
});
const startRazorpayCheckout = async (booking, amount) => {
    const order = await api.createRazorpayOrder(booking.id, amount);
    if (!order.success) throw new Error(order.error);
    await loadRazorpay();
    return new Promise((resolve, reject) => new window.Razorpay({ key: order.data.key_id, amount: order.data.amount, currency: order.data.currency, order_id: order.data.order_id, name: "TimeBuddy", description: "Booking payment", handler: async (response) => {
        const verified = await api.verifyRazorpayPayment(response); verified.success ? resolve() : reject(new Error(verified.error));
    }, modal: { ondismiss: () => reject(new Error("Payment cancelled")) } }).open());
};

// const availableDates = computed(() => {
//     if (!helper.value || !helper.value.availability) return [];
//     return helper.value.availability.map((day) => daysOfWeek.indexOf(day));
// });

const bookedSlots = ref([]);

const fetchBookedSlots = async () => {
    if (helper.value && helper.value.id) {
        await bookingStore.fetchBookings(helper.value.id, "helper");
        if (!bookingStore.bookings) return;
        bookedSlots.value = bookingStore.bookings
            .filter(
                (b) =>
                    b.status === "pending" ||
                    b.status === "accepted" ||
                    b.status === "in_progress"
            )
            .flatMap((b) => {
                const start = new Date(`${b.date}T${b.start_time}`);
                const end = new Date(`${b.date}T${b.end_time}`);
                const disabledTimes = [];
                while (start < end) {
                    disabledTimes.push({
                        hours: start.getHours(),
                        minutes: start.getMinutes(),
                    });
                    start.setMinutes(start.getMinutes() + 15); // Increment by 15 minutes
                }
                return disabledTimes;
            });
    }
};

onMounted(async () => {
    await helperStore.fetchHelper(route.params.id);
    if (helper.value.id) {
        reviewStore.fetchReviews(helper.value.id);
        await fetchBookedSlots();
    }
});
const handleBooking = async () => {
    if (!authStore.isAuthenticated) {
        router.push("/login");
        return;
    }
    error.dateErr = false;
    error.startTimeErr = false;
    await loadQuote();
    if (quoteError.value) return;
    if (!bookingForm.date) {
        error.dateErr = true;
        return;
    }
    if (!bookingForm.startTime) {
        error.startTimeErr = true;
        return;
    }

    const bookingData = {
        customer_id: authStore.user.id,
        helper_id: helper.value.id,
        helper_name: helper.value.name,
        helper_avatar: helper.value.avatar,
        date: bookingForm.date,
        start_time: `${bookingForm.startTime.hours
            .toString()
            .padStart(2, "0")}:${bookingForm.startTime.minutes}`,
        end_time: calculateEndTime(),
        hours: bookingForm.hours,
        rate: helper.value.hourlyRate,
        total_amount: checkoutQuote.value?.total_customer_amount || totalAmount.value,
        category: bookingForm.category,
        description: bookingForm.description,
        payment_method: bookingForm.paymentPlan === "full_cash" ? "CASH" : "UPI",
        location: "",
    };

    const booking = await bookingStore.createBooking(bookingData);

    if (booking) {
        // Trigger payment collection if UPI is selected
        // if (bookingForm.paymentMethod === "UPI") {
        const paymentData = {
            booking_id: booking.id,
            customer_id: authStore.user.id,
            helper_id: helper.value.id,
            amount: checkoutQuote.value?.online_amount || totalAmount.value,
            payment_method: bookingForm.paymentPlan === "full_cash" ? "CASH" : "UPI",
        };
        if (bookingForm.paymentPlan !== "full_cash") await startRazorpayCheckout(booking, paymentData.amount);

        alert("Booking request sent successfully!");
        router.push("/bookings");
    }
};

const calculateEndTime = () => {
    // const [hours, minutes] = bookingForm.startTime.split(":");
    const endHour = parseInt(bookingForm.startTime.hours) + bookingForm.hours;
    return `${endHour.toString().padStart(2, "0")}:${bookingForm.startTime.minutes
        }`;
};
</script>

<template>
    <div class="mb-6 border-b border-gray-200">
        <nav class="flex space-x-8">
            <button
                v-for="tab in tabs"
                :key="tab.key"
                @click="$emit('update:activeTab', tab.key)"
                :class="[
                    'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                    activeTab === tab.key
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                ]"
            >
                {{ tab.label }} ({{ tab.count.length }})
            </button>
        </nav>
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useBookingStore } from "../../stores/booking";
const bookingStore = useBookingStore();

const props = defineProps({
    activeTab: String,
});

const tabs = computed(() => [
    {
        key: "upcoming",
        label: "Upcoming",
        count: bookingStore.getBookings("upcoming") || 0,
    },
    {
        key: "pending",
        label: "Pending",
        count: bookingStore.getBookings("pending") || 0,
    },
    {
        key: "accepted",
        label: "Accepted",
        count: bookingStore.getBookings("accepted") || 0,
    },
    {
        key: "rejected",
        label: "Rejected",
        count: bookingStore.getBookings("rejected") || 0,
    },
    {
        key: "in_progress",
        label: "In Progress",
        count: bookingStore.getBookings("in_progress") || 0,
    },
    {
        key: "completed",
        label: "Completed",
        count: bookingStore.getBookings("completed") || 0,
    },
    {
        key: "cancelled",
        label: "Cancelled",
        count: bookingStore.getBookings("cancelled") || 0,
    },
    {
        key: "disputed",
        label: "Disputed",
        count: bookingStore.getBookings("disputed") || 0,
    },
]);
</script>

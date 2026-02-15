<template>
    <div class="min-h-screen bg-gray-50 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">
                    Admin Dashboard
                </h1>
                <p class="text-gray-600">Manage platform operations</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div
                    class="card bg-gradient-to-br from-blue-500 to-cyan-500 text-white"
                >
                    <div class="text-sm font-medium mb-2">Total Helpers</div>
                    <div class="text-3xl font-bold">
                        {{ stats.totalHelpers.toLocaleString() }}
                    </div>
                </div>
                <div
                    class="card bg-gradient-to-br from-green-500 to-emerald-500 text-white"
                >
                    <div class="text-sm font-medium mb-2">Total Customers</div>
                    <div class="text-3xl font-bold">
                        {{ stats.totalCustomers.toLocaleString() }}
                    </div>
                </div>
                <div
                    class="card bg-gradient-to-br from-orange-500 to-amber-500 text-white"
                >
                    <div class="text-sm font-medium mb-2">Active Bookings</div>
                    <div class="text-3xl font-bold">
                        {{ stats.activeBookings }}
                    </div>
                </div>
                <div
                    class="card bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                >
                    <div class="text-sm font-medium mb-2">Monthly Revenue</div>
                    <div class="text-3xl font-bold">
                        ₹{{ (stats.monthlyRevenue / 1000).toFixed(0) }}K
                    </div>
                </div>
            </div>

            <div class="mb-6 border-b border-gray-200">
                <nav class="flex space-x-8">
                    <button
                        @click="activeTab = 'verifications'"
                        :class="[
                            'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                            activeTab === 'verifications'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700',
                        ]"
                    >
                        Pending Verifications
                    </button>
                    <button
                        @click="activeTab = 'users'"
                        :class="[
                            'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                            activeTab === 'users'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700',
                        ]"
                    >
                        Users
                    </button>
                    <button
                        @click="activeTab = 'disputes'"
                        :class="[
                            'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                            activeTab === 'disputes'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700',
                        ]"
                    >
                        Disputes
                    </button>
                    <button
                        @click="activeTab = 'analytics'"
                        :class="[
                            'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                            activeTab === 'analytics'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700',
                        ]"
                    >
                        Analytics
                    </button>
                </nav>
            </div>

            <div v-if="activeTab === 'verifications'" class="card">
                <h2 class="text-xl font-semibold mb-6 text-gray-900">
                    Pending ID Verifications
                </h2>

                <div class="space-y-4">
                    <div
                        v-for="verification in pendingVerifications"
                        :key="verification.id"
                        class="border border-gray-200 rounded-lg p-4"
                    >
                        <div class="flex items-start justify-between">
                            <div class="flex items-start space-x-4">
                                <img
                                    :src="verification.avatar"
                                    :alt="verification.name"
                                    class="w-16 h-16 rounded-full object-cover"
                                />
                                <div>
                                    <h3 class="font-semibold text-gray-900">
                                        {{ verification.name }}
                                    </h3>
                                    <p class="text-sm text-gray-600">
                                        {{ verification.email }}
                                    </p>
                                    <p class="text-sm text-gray-600">
                                        {{ verification.phone }}
                                    </p>
                                    <span class="badge badge-warning mt-2"
                                        >Pending Review</span
                                    >
                                </div>
                            </div>

                            <div class="flex space-x-2">
                                <button
                                    @click="
                                        approveVerification(verification.id)
                                    "
                                    class="btn btn-success text-sm"
                                >
                                    Approve
                                </button>
                                <button
                                    @click="rejectVerification(verification.id)"
                                    class="btn btn-danger text-sm"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="activeTab === 'users'" class="card">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-xl font-semibold text-gray-900">
                        User Management
                    </h2>
                    <div class="flex space-x-4">
                        <input
                            v-model="userSearch"
                            type="text"
                            placeholder="Search users..."
                            class="input w-64"
                        />
                        <select v-model="userFilter" class="input">
                            <option value="all">All Users</option>
                            <option value="customers">Customers</option>
                            <option value="helpers">Helpers</option>
                        </select>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    User
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Role
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Status
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Joined
                                </th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="user in filteredUsers" :key="user.id">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <img
                                            :src="user.avatar"
                                            :alt="user.name"
                                            class="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div class="ml-4">
                                            <div
                                                class="font-medium text-gray-900"
                                            >
                                                {{ user.name }}
                                            </div>
                                            <div class="text-sm text-gray-500">
                                                {{ user.email }}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="badge badge-primary">{{
                                        user.role
                                    }}</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                        :class="[
                                            'badge',
                                            user.verified
                                                ? 'badge-success'
                                                : 'badge-warning',
                                        ]"
                                    >
                                        {{
                                            user.verified
                                                ? "Verified"
                                                : "Unverified"
                                        }}
                                    </span>
                                </td>
                                <td
                                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                >
                                    {{ formatDate(user.memberSince) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm">
                                    <button
                                        class="text-primary-600 hover:text-primary-700 mr-3"
                                    >
                                        View
                                    </button>
                                    <button
                                        class="text-danger-600 hover:text-danger-700"
                                    >
                                        Suspend
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div v-if="activeTab === 'disputes'" class="card">
                <h2 class="text-xl font-semibold mb-6 text-gray-900">
                    Active Disputes
                </h2>

                <div class="text-center py-12">
                    <div class="text-6xl mb-4">⚖️</div>
                    <div class="text-xl text-gray-600 mb-2">
                        No active disputes
                    </div>
                    <p class="text-gray-500">All resolved</p>
                </div>
            </div>

            <div v-if="activeTab === 'analytics'" class="card">
                <h2 class="text-xl font-semibold mb-6 text-gray-900">
                    Platform Analytics
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 class="font-medium text-gray-900 mb-4">
                            Revenue Overview
                        </h3>
                        <div class="space-y-3">
                            <div
                                class="flex justify-between items-center p-3 bg-gray-50 rounded"
                            >
                                <span class="text-gray-600">Total Revenue</span>
                                <span class="font-semibold"
                                    >₹{{
                                        stats.totalRevenue.toLocaleString()
                                    }}</span
                                >
                            </div>
                            <div
                                class="flex justify-between items-center p-3 bg-gray-50 rounded"
                            >
                                <span class="text-gray-600">This Month</span>
                                <span class="font-semibold"
                                    >₹{{
                                        stats.monthlyRevenue.toLocaleString()
                                    }}</span
                                >
                            </div>
                            <div
                                class="flex justify-between items-center p-3 bg-gray-50 rounded"
                            >
                                <span class="text-gray-600"
                                    >Completed Bookings</span
                                >
                                <span class="font-semibold">{{
                                    stats.completedBookings.toLocaleString()
                                }}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 class="font-medium text-gray-900 mb-4">
                            User Growth
                        </h3>
                        <div class="space-y-3">
                            <div
                                class="flex justify-between items-center p-3 bg-gray-50 rounded"
                            >
                                <span class="text-gray-600">Total Helpers</span>
                                <span class="font-semibold">{{
                                    stats.totalHelpers.toLocaleString()
                                }}</span>
                            </div>
                            <div
                                class="flex justify-between items-center p-3 bg-gray-50 rounded"
                            >
                                <span class="text-gray-600"
                                    >Total Customers</span
                                >
                                <span class="font-semibold">{{
                                    stats.totalCustomers.toLocaleString()
                                }}</span>
                            </div>
                            <div
                                class="flex justify-between items-center p-3 bg-gray-50 rounded"
                            >
                                <span class="text-gray-600">Active Users</span>
                                <span class="font-semibold">
                                    {{
                                        (
                                            stats.totalHelpers +
                                            stats.totalCustomers
                                        ).toLocaleString()
                                    }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { api } from "../services/api";
import { mockHelpers, mockUser } from "../services/mockData";

const activeTab = ref("verifications");
const stats = ref({
    totalHelpers: 0,
    totalCustomers: 0,
    completedBookings: 0,
    activeBookings: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
});

const userSearch = ref("");
const userFilter = ref("all");

const pendingVerifications = ref([
    {
        id: 1,
        name: "New Helper 1",
        email: "helper1@example.com",
        phone: "+91 98765 43210",
        avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?w=200",
    },
    {
        id: 2,
        name: "New Helper 2",
        email: "helper2@example.com",
        phone: "+91 98765 43211",
        avatar: "https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?w=200",
    },
]);

const allUsers = ref([
    { ...mockUser, role: "customer", memberSince: "2025-08-15" },
    ...mockHelpers.map((h) => ({
        ...h,
        role: "helper",
        email: `${h.name.toLowerCase().replace(" ", ".")}@example.com`,
        memberSince: "2024-03-20",
    })),
]);

const filteredUsers = computed(() => {
    let users = allUsers.value;

    if (userFilter.value !== "all") {
        users = users.filter((u) => u.role === userFilter.value.slice(0, -1));
    }

    if (userSearch.value) {
        const search = userSearch.value.toLowerCase();
        users = users.filter(
            (u) =>
                u.name.toLowerCase().includes(search) ||
                u.email.toLowerCase().includes(search)
        );
    }

    return users;
});

onMounted(async () => {
    const response = await api.getStats();
    if (response.success) {
        stats.value = response.data;
    }
});

const approveVerification = (id) => {
    pendingVerifications.value = pendingVerifications.value.filter(
        (v) => v.id !== id
    );
    alert("Verification approved!");
};

const rejectVerification = (id) => {
    pendingVerifications.value = pendingVerifications.value.filter(
        (v) => v.id !== id
    );
    alert("Verification rejected");
};

const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
    });
};
</script>

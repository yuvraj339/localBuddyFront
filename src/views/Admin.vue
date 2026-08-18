<template>
    <div class="min-h-screen bg-gray-50 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">
                    Admin Dashboard
                </h1>
                <p class="text-gray-600">Manage platform operations</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <div v-for="card in dashboardCards" :key="card.label"
                    :class="['card bg-gradient-to-br text-white', card.color]">
                    <div class="text-sm font-medium mb-2">{{ card.label }}</div>
                    <div class="text-3xl font-bold">{{ card.value }}</div>
                    <div v-if="card.detail" class="mt-1 text-sm text-white/80">{{ card.detail }}</div>
                </div>
            </div>

            <div class="mb-6 border-b border-gray-200">
                <nav class="flex space-x-8">
                    <button @click="activeTab = 'verifications'" :class="[
                        'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                        activeTab === 'verifications'
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700',
                    ]">
                        Pending Verifications
                    </button>
                    <button @click="activeTab = 'users'" :class="[
                        'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                        activeTab === 'users'
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700',
                    ]">
                        Users
                    </button>
                    <button @click="activeTab = 'disputes'" :class="[
                        'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                        activeTab === 'disputes'
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700',
                    ]">
                        Disputes
                    </button>
                    <button @click="activeTab = 'analytics'" :class="[
                        'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                        activeTab === 'analytics'
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700',
                    ]">
                        Analytics
                    </button>
                    <router-link to="/admin/roles-permissions" :class="[
                        'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                        'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    ]">
                        Roles & Permissions
                    </router-link>
                    <router-link to="/admin/categories" :class="[
                        'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                        'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    ]">
                        Categories
                    </router-link>
                </nav>
            </div>

            <div v-if="activeTab === 'verifications'" class="card">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h2 class="text-xl font-semibold text-gray-900">Pending ID Verifications</h2>
                        <p class="text-sm text-gray-500 mt-1">Review helper identity submissions before approving them.
                        </p>
                    </div>
                    <span class="badge badge-warning">{{ pendingVerifications.length }} pending</span>
                </div>

                <div v-if="!pendingVerifications.length" class="text-center py-12">
                    <div class="text-4xl mb-3">✓</div>
                    <p class="font-medium text-gray-900">No pending verifications</p>
                    <p class="text-sm text-gray-500 mt-1">New helper submissions will appear here.</p>
                </div>

                <div v-else class="space-y-4">
                    <div v-for="verification in pendingVerifications" :key="verification.id"
                        class="border border-gray-200 rounded-xl p-5">
                        <div class="flex items-start justify-between">
                            <div class="flex items-start space-x-4">
                                <img v-if="verification.avatar" :src="verification.avatar" :alt="verification.name"
                                    class="w-16 h-16 rounded-full object-cover" />
                                <div v-else
                                    class="w-16 h-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xl font-semibold">
                                    {{ verification.name.charAt(0) }}
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-900">{{ verification.name }}</h3>
                                    <p class="text-sm text-gray-600">{{ verification.email }}</p>
                                    <p class="text-sm text-gray-600">{{ verification.phone }}</p>
                                    <span class="badge badge-warning mt-2">Pending Review</span>
                                </div>
                            </div>
                            <div class="flex space-x-2">
                                <button @click="reviewVerification(verification.id, 'rejected')"
                                    :disabled="reviewingId === verification.id" class="btn btn-danger text-sm">
                                    Reject
                                </button>
                                <button @click="reviewVerification(verification.id, 'approved')"
                                    :disabled="reviewingId === verification.id" class="btn btn-success text-sm">
                                    {{ reviewingId === verification.id ? 'Saving...' : 'Approve' }}
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
                        <input v-model="userSearch" type="text" placeholder="Search users..." class="input w-64" />
                        <select v-model="userFilter" class="input">
                            <option value="all">All Users</option>
                            <option value="customers">Customers</option>
                            <option value="helpers">Helpers</option>
                        </select>
                        <select v-model="userPageSize" class="input">
                            <option :value="10">10 per page</option>
                            <option :value="25">25 per page</option>
                            <option :value="50">50 per page</option>
                        </select>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th @click="toggleSort('name')"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                    User {{ sortIndicator('name') }}
                                </th>
                                <th @click="toggleSort('role')"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                    Role {{ sortIndicator('role') }}
                                </th>
                                <th @click="toggleSort('verified')"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                    Verification {{ sortIndicator('verified') }}
                                </th>
                                <th @click="toggleSort('memberSince')"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                    Joined {{ sortIndicator('memberSince') }}
                                </th>
                                <th @click="toggleSort('isActive')"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                    Account {{ sortIndicator('isActive') }}
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="user in allUsers" :key="user.id">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <img v-if="user.avatar" :src="user.avatar" :alt="user.name"
                                            class="w-10 h-10 rounded-full object-cover" />
                                        <div v-else
                                            class="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-semibold">
                                            {{ user.name.charAt(0) }}
                                        </div>
                                        <div class="ml-4">
                                            <div class="font-medium text-gray-900">
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
                                    <span :class="[
                                        'badge',
                                        user.verified
                                            ? 'badge-success'
                                            : 'badge-warning',
                                    ]">
                                        {{
                                            user.verified
                                                ? "Verified"
                                                : "Unverified"
                                        }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ formatDate(user.memberSince) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm">
                                    <button @click="toggleUserStatus(user)" :disabled="updatingUserId === user.id"
                                        :class="user.isActive ? 'text-danger-600 hover:text-danger-700' : 'text-green-600 hover:text-green-700'">
                                        {{ updatingUserId === user.id ? 'Saving...' : user.isActive ? 'Suspend' :
                                            'Activate' }}
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="flex items-center justify-between mt-6 text-sm text-gray-600">
                    <span>Showing {{ userRangeStart }}–{{ userRangeEnd }} of {{ userTotal }} users</span>
                    <div class="flex items-center space-x-3">
                        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                            class="btn btn-secondary text-sm">Previous</button>
                        <span>Page {{ currentPage }} of {{ totalPages }}</span>
                        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                            class="btn btn-secondary text-sm">Next</button>
                    </div>
                </div>
            </div>

            <div v-if="activeTab === 'disputes'" class="card">
                <h2 class="text-xl font-semibold mb-6 text-gray-900">
                    Active Disputes
                </h2>

                <div v-if="!disputes.length" class="text-center py-12">
                    <div class="text-6xl mb-4">⚖️</div>
                    <div class="text-xl text-gray-600 mb-2">
                        No active disputes
                    </div>
                    <p class="text-gray-500">All resolved</p>
                </div>
                <div v-else class="space-y-4">
                    <div v-for="dispute in disputes" :key="dispute.id" class="border border-red-200 rounded-lg p-4">
                        <div class="flex justify-between gap-4">
                            <div>
                                <h3 class="font-semibold text-gray-900">{{ dispute.category }} booking</h3>
                                <p class="text-sm text-gray-600">{{ dispute.customerName }} · {{ dispute.customerEmail
                                    }}</p>
                                <p v-if="dispute.description" class="mt-2 text-sm text-gray-700">{{ dispute.description
                                    }}</p>
                            </div>
                            <div class="text-right text-sm">
                                <p class="font-semibold">₹{{ dispute.amount.toLocaleString() }}</p>
                                <p class="text-gray-500">{{ formatDate(dispute.createdAt) }}</p>
                            </div>
                        </div>
                    </div>
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
                            <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <span class="text-gray-600">Total Revenue</span>
                                <span class="font-semibold">₹{{
                                    stats.totalRevenue.toLocaleString()
                                    }}</span>
                            </div>
                            <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <span class="text-gray-600">This Month</span>
                                <span class="font-semibold">₹{{
                                    stats.monthlyRevenue.toLocaleString()
                                    }}</span>
                            </div>
                            <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <span class="text-gray-600">Completed Bookings</span>
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
                            <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <span class="text-gray-600">Total Helpers</span>
                                <span class="font-semibold">{{
                                    stats.totalHelpers.toLocaleString()
                                }}</span>
                            </div>
                            <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <span class="text-gray-600">Total Customers</span>
                                <span class="font-semibold">{{
                                    stats.totalCustomers.toLocaleString()
                                }}</span>
                            </div>
                            <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <span class="text-gray-600">Active Users</span>
                                <span class="font-semibold">
                                    {{
                                        (
                                            stats.activeHelpers +
                                            stats.activeCustomers
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
import { ref, computed, onMounted, reactive, watch } from "vue";
import { api } from "../services/api";

const activeTab = ref("verifications");
const stats = reactive({
    totalHelpers: 0,
    totalCustomers: 0,
    activeHelpers: 0,
    activeCustomers: 0,
    completedBookings: 0,
    activeBookings: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
});

const userSearch = ref("");
const userFilter = ref("all");
const userPageSize = ref(10);
const currentPage = ref(1);
const totalPages = ref(1);
const userTotal = ref(0);
const userSortBy = ref("memberSince");
const userSortOrder = ref("desc");

const pendingVerifications = ref([]);
const allUsers = ref([]);
const disputes = ref([]);
const reviewingId = ref(null);
const updatingUserId = ref(null);

const dashboardCards = computed(() => [
    {
        label: "Total Helpers",
        value: stats.totalHelpers.toLocaleString(),
        detail: `${stats.activeHelpers.toLocaleString()} active`,
        color: "from-blue-500 to-cyan-500",
    },
    {
        label: "Total Customers",
        value: stats.totalCustomers.toLocaleString(),
        detail: `${stats.activeCustomers.toLocaleString()} active`,
        color: "from-green-500 to-emerald-500",
    },
    {
        label: "Active Bookings",
        value: stats.activeBookings.toLocaleString(),
        color: "from-orange-500 to-amber-500",
    },
    {
        label: "Monthly Revenue",
        value: `₹${(stats.monthlyRevenue / 1000).toFixed(0)}K`,
        color: "from-purple-500 to-pink-500",
    },
]);

const userRangeStart = computed(() => userTotal.value ? (currentPage.value - 1) * userPageSize.value + 1 : 0);
const userRangeEnd = computed(() => Math.min(currentPage.value * userPageSize.value, userTotal.value));

const loadUsers = async () => {
    const response = await api.getAdminUsers({
        page: currentPage.value,
        page_size: userPageSize.value,
        role: userFilter.value === "all" ? "" : userFilter.value.slice(0, -1),
        search: userSearch.value,
        sort_by: userSortBy.value,
        sort_order: userSortOrder.value,
    });

    if (!response.success) return;
    allUsers.value = response.data.items;
    userTotal.value = response.data.total;
    totalPages.value = response.data.totalPages;
}

onMounted(async () => {
    const [statsResponse, verificationsResponse, disputesResponse] = await Promise.all([
        api.getStats(),
        api.getAdminVerifications(),
        api.getAdminDisputes(),
    ]);

    if (statsResponse.success) Object.assign(stats, statsResponse.data);
    if (verificationsResponse.success) pendingVerifications.value = verificationsResponse.data;
    if (disputesResponse.success) disputes.value = disputesResponse.data;
    await loadUsers();
});

watch([userSearch, userFilter, userPageSize], () => {
    currentPage.value = 1;
    loadUsers();
});

const changePage = (page) => {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
    loadUsers();
};

const toggleSort = (field) => {
    if (userSortBy.value === field) {
        userSortOrder.value = userSortOrder.value === "asc" ? "desc" : "asc";
    } else {
        userSortBy.value = field;
        userSortOrder.value = "asc";
    }
    currentPage.value = 1;
    loadUsers();
};

const sortIndicator = (field) => userSortBy.value === field
    ? userSortOrder.value === "asc" ? "↑" : "↓"
    : "";

const reviewVerification = async (userId, decision) => {
    reviewingId.value = userId;
    const response = await api.reviewVerification(userId, decision);
    reviewingId.value = null;

    if (!response.success) {
        alert(response.error || "Unable to review verification");
        return;
    }

    pendingVerifications.value = pendingVerifications.value.filter((user) => user.id !== userId);
    allUsers.value = allUsers.value.map((user) => user.id === userId ? response.data.user : user);
};

const toggleUserStatus = async (user) => {
    updatingUserId.value = user.id;
    const response = await api.updateAdminUserStatus(user.id, !user.isActive);
    updatingUserId.value = null;

    if (!response.success) {
        alert(response.error || "Unable to update account status");
        return;
    }

    allUsers.value = allUsers.value.map((item) => item.id === user.id ? response.data.user : item);
    pendingVerifications.value = pendingVerifications.value.filter((item) => item.id !== user.id || response.data.user.isActive);

    const statsResponse = await api.getStats();
    if (statsResponse.success) Object.assign(stats, statsResponse.data);
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

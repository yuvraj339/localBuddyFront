<template>
    <nav class="bg-white shadow-md sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center space-x-8">
                    <router-link to="/" class="flex items-center space-x-2">
                        <span class="text-2xl font-bold text-primary-600"
                            >TimeBuddy</span
                        >
                    </router-link>

                    <div
                        v-if="authStore.isAuthenticated"
                        class="hidden md:flex space-x-4"
                    >
                        <router-link
                            v-if="authStore.isCustomer"
                            to="/helpers"
                            class="nav-link"
                            active-class="nav-link-active"
                        >
                            Find Helpers
                        </router-link>
                        <router-link
                            to="/bookings"
                            class="nav-link"
                            active-class="nav-link-active"
                        >
                            Bookings
                        </router-link>
                        <router-link
                            to="/chat"
                            class="nav-link relative"
                            active-class="nav-link-active"
                        >
                            Messages
                            <span
                                v-if="unreadCount > 0"
                                class="absolute -top-1 -right-1 bg-danger-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                            >
                                {{ unreadCount }}
                            </span>
                        </router-link>
                    </div>
                </div>

                <div class="flex items-center space-x-4">
                    <template v-if="!authStore.isAuthenticated">
                        <router-link
                            to="/login"
                            class="btn btn-secondary text-sm"
                        >
                            Login
                        </router-link>
                        <router-link
                            to="/register"
                            class="btn btn-primary text-sm"
                        >
                            Sign Up
                        </router-link>
                    </template>

                    <template v-else>
                        <router-link
                            v-if="authStore.isHelper"
                            to="/helper-dashboard"
                            class="btn btn-primary text-sm"
                        >
                            Dashboard
                        </router-link>
                        <router-link
                            v-else-if="authStore.isCustomer"
                            to="/dashboard"
                            class="btn btn-primary text-sm"
                        >
                            Dashboard
                        </router-link>

                        <div class="relative" ref="dropdown">
                            <button
                                @click="showDropdown = !showDropdown"
                                class="flex items-center space-x-2 focus:outline-none"
                            >
                                <img
                                    :src="authStore.user?.avatar"
                                    alt="Profile"
                                    class="w-10 h-10 rounded-full object-cover border-2 border-primary-200"
                                />
                            </button>

                            <div
                                v-if="showDropdown"
                                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200"
                            >
                                <router-link
                                    to="/profile"
                                    class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    @click="showDropdown = false"
                                >
                                    My Profile
                                </router-link>
                                <button
                                    @click="handleLogout"
                                    class="w-full text-left px-4 py-2 text-danger-600 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const showDropdown = ref(false);
const unreadCount = ref(2);
const dropdown = ref(null);

const handleLogout = () => {
    authStore.logout();
    showDropdown.value = false;
    router.push("/");
};

const handleClickOutside = (event) => {
    if (dropdown.value && !dropdown.value.contains(event.target)) {
        showDropdown.value = false;
    }
};

onMounted(() => {
    document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.nav-link {
    @apply text-gray-700 hover:text-primary-600 font-medium transition-colors px-3 py-2 rounded-lg;
}

.nav-link-active {
    @apply text-primary-600 bg-primary-50;
}
</style>

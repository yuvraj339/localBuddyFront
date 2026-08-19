<template>
    <nav class="bg-white shadow-md sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <!-- Logo -->
                <router-link to="/" class="flex items-center space-x-2 shrink-0" @click="closeMobileMenu">
                    <span class="text-2xl font-bold text-primary-600">TimeBuddy</span>
                </router-link>

                <!-- Desktop nav links -->
                <div v-if="authStore.isAuthenticated" class="hidden md:flex items-center space-x-1 ml-8 flex-1">
                    <router-link v-if="authStore.hasRole('customer')" to="/helpers" class="nav-link"
                        active-class="nav-link-active">
                        {{ t("nav.findHelpers") }}
                    </router-link>
                    <router-link to="/bookings" class="nav-link" active-class="nav-link-active">
                        {{ t("nav.bookings") }}
                    </router-link>
                    <router-link to="/chat" class="nav-link relative" active-class="nav-link-active">
                        {{ t("nav.messages") }}
                        <span v-if="unreadCount > 0"
                            class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[1.25rem] h-5 px-1 flex items-center justify-center">
                            {{ unreadCount }}
                        </span>
                    </router-link>
                    <router-link v-if="authStore.hasRole('helper')" to="/helper-dashboard" class="nav-link"
                        active-class="nav-link-active">
                        {{ t("nav.dashboard") }}
                    </router-link>
                    <router-link v-else-if="authStore.hasRole('customer')" to="/dashboard" class="nav-link"
                        active-class="nav-link-active">
                        {{ t("nav.dashboard") }}
                    </router-link>
                    <router-link v-else-if="authStore.hasRole('super_admin')" to="/admin" class="nav-link"
                        active-class="nav-link-active">
                        {{ t("nav.dashboard") }}
                    </router-link>
                </div>

                <!-- Desktop right side -->
                <div class="hidden md:flex items-center space-x-3">
                    <div class="relative" ref="langDropdown">
                        <button @click="showLangMenu = !showLangMenu"
                            class="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                            :aria-expanded="showLangMenu" aria-haspopup="true" :aria-label="t('nav.language')">
                            <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 12h18M12 3c2.5 2.8 4 6.4 4 9s-1.5 6.2-4 9c-2.5-2.8-4-6.4-4-9s1.5-6.2 4-9z" />
                                <circle cx="12" cy="12" r="9" stroke-width="2" />
                            </svg>
                            <span class="font-medium uppercase text-xs">{{ locale }}</span>
                        </button>

                        <transition enter-active-class="transition ease-out duration-150"
                            enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100"
                            leave-active-class="transition ease-in duration-100"
                            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                            <div v-if="showLangMenu"
                                class="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-1 border border-gray-200 origin-top-right max-h-64 overflow-y-auto">
                                <button v-for="language in supportedLanguages" :key="language.code"
                                    @click="selectLocale(language.code)"
                                    class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center justify-between"
                                    :class="locale === language.code ? 'text-primary-600 font-medium' : 'text-gray-700'">
                                    {{ language.nativeLabel }}
                                    <svg v-if="locale === language.code" class="w-4 h-4 text-primary-600" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M5 13l4 4L19 7" />
                                    </svg>
                                </button>
                            </div>
                        </transition>
                    </div>

                    <template v-if="!authStore.isAuthenticated">
                        <router-link to="/login" class="btn btn-secondary text-sm">
                            {{ t("nav.login") }}
                        </router-link>
                        <router-link to="/register" class="btn btn-primary text-sm">
                            {{ t("nav.signUp") }}
                        </router-link>
                    </template>

                    <template v-else>
                        <div class="relative" ref="dropdown">
                            <button @click="showDropdown = !showDropdown"
                                class="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                                :aria-expanded="showDropdown" aria-haspopup="true">
                                <img :src="avatarSrc(authStore.user?.avatar_url)" alt="Profile"
                                    class="w-9 h-9 rounded-full object-cover border-2 border-primary-200 shrink-0" />
                                <span class="text-sm font-medium text-gray-700 max-w-[9rem] truncate">
                                    {{ authStore.user?.full_name }}
                                </span>
                                <svg class="w-4 h-4 text-gray-400 transition-transform shrink-0"
                                    :class="{ 'rotate-180': showDropdown }" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <transition enter-active-class="transition ease-out duration-150"
                                enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100"
                                leave-active-class="transition ease-in duration-100"
                                leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                                <div v-if="showDropdown"
                                    class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200 origin-top-right">
                                    <router-link to="/profile"
                                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        @click="showDropdown = false">
                                        {{ t("nav.myProfile") }}
                                    </router-link>
                                    <button @click="handleLogout"
                                        class="w-full text-left px-4 py-2 text-sm text-danger-600 hover:bg-gray-100">
                                        {{ t("nav.logout") }}
                                    </button>
                                </div>
                            </transition>
                        </div>
                    </template>
                </div>

                <!-- Mobile controls -->
                <div class="flex items-center gap-1 md:hidden">
                    <img v-if="authStore.isAuthenticated" :src="avatarSrc(authStore.user?.avatar_url)" alt="Profile"
                        class="w-8 h-8 rounded-full object-cover border-2 border-primary-200 mr-1" />
                    <button @click="mobileMenuOpen = !mobileMenuOpen"
                        class="relative inline-flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        :aria-expanded="mobileMenuOpen" aria-label="Toggle navigation menu">
                        <span v-if="unreadCount > 0 && !mobileMenuOpen"
                            class="absolute top-1 right-1 bg-red-500 w-2 h-2 rounded-full"></span>
                        <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile menu panel -->
        <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
            <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200 bg-white shadow-lg">
                <div class="px-4 pt-3 pb-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
                    <template v-if="authStore.isAuthenticated">
                        <div class="flex items-center gap-3 px-2 py-3 mb-1 border-b border-gray-100">
                            <img :src="avatarSrc(authStore.user?.avatar_url)" alt="Profile"
                                class="w-11 h-11 rounded-full object-cover border-2 border-primary-200 shrink-0" />
                            <span class="text-sm font-semibold text-gray-800 truncate">
                                {{ authStore.user?.full_name }}
                            </span>
                        </div>

                        <router-link v-if="authStore.hasRole('customer')" to="/helpers" class="mobile-link"
                            active-class="mobile-link-active" @click="closeMobileMenu">
                            {{ t("nav.findHelpers") }}
                        </router-link>
                        <router-link to="/bookings" class="mobile-link" active-class="mobile-link-active"
                            @click="closeMobileMenu">
                            {{ t("nav.bookings") }}
                        </router-link>
                        <router-link to="/chat" class="mobile-link flex items-center justify-between"
                            active-class="mobile-link-active" @click="closeMobileMenu">
                            <span>{{ t("nav.messages") }}</span>
                            <span v-if="unreadCount > 0"
                                class="bg-red-500 text-white text-xs rounded-full min-w-[1.25rem] h-5 px-1 flex items-center justify-center">
                                {{ unreadCount }}
                            </span>
                        </router-link>
                        <router-link v-if="authStore.hasRole('helper')" to="/helper-dashboard" class="mobile-link"
                            active-class="mobile-link-active" @click="closeMobileMenu">
                            {{ t("nav.dashboard") }}
                        </router-link>
                        <router-link v-else-if="authStore.hasRole('customer')" to="/dashboard" class="mobile-link"
                            active-class="mobile-link-active" @click="closeMobileMenu">
                            {{ t("nav.dashboard") }}
                        </router-link>
                        <router-link v-else-if="authStore.hasRole('super_admin')" to="/admin" class="mobile-link"
                            active-class="mobile-link-active" @click="closeMobileMenu">
                            {{ t("nav.dashboard") }}
                        </router-link>

                        <router-link to="/profile" class="mobile-link" active-class="mobile-link-active"
                            @click="closeMobileMenu">
                            {{ t("nav.myProfile") }}
                        </router-link>
                        <button @click="handleLogout"
                            class="w-full text-left mobile-link text-danger-600 hover:bg-red-50">
                            {{ t("nav.logout") }}
                        </button>
                    </template>

                    <template v-else>
                        <router-link to="/login" class="btn btn-secondary w-full justify-center text-sm"
                            @click="closeMobileMenu">
                            {{ t("nav.login") }}
                        </router-link>
                        <router-link to="/register" class="btn btn-primary w-full justify-center text-sm mt-2"
                            @click="closeMobileMenu">
                            {{ t("nav.signUp") }}
                        </router-link>
                    </template>

                    <div class="pt-3 mt-2 border-t border-gray-100">
                        <span class="block text-xs font-medium text-gray-500 mb-2 px-2">
                            {{ t("nav.language") }}
                        </span>
                        <div class="flex flex-wrap gap-2 px-2">
                            <button v-for="language in supportedLanguages" :key="language.code"
                                @click="selectLocale(language.code)"
                                class="px-3 py-1.5 rounded-full text-sm font-medium border transition-colors" :class="locale === language.code
                                    ? 'bg-primary-600 text-white border-primary-600'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'">
                                {{ language.nativeLabel }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { avatarSrc } from "../utils/util";
import { useI18n } from "../i18n";
const router = useRouter();
const authStore = useAuthStore();
const { locale, setLocale, supportedLanguages, t } = useI18n();

const showDropdown = ref(false);
const showLangMenu = ref(false);
const mobileMenuOpen = ref(false);
const unreadCount = ref(0);
const dropdown = ref(null);
const langDropdown = ref(null);

const closeMobileMenu = () => {
    mobileMenuOpen.value = false;
};

const selectLocale = (code) => {
    setLocale(code);
    showLangMenu.value = false;
};

const handleLogout = () => {
    authStore.logout();
    showDropdown.value = false;
    mobileMenuOpen.value = false;
    router.push("/");
};

const handleClickOutside = (event) => {
    if (dropdown.value && !dropdown.value.contains(event.target)) {
        showDropdown.value = false;
    }
    if (langDropdown.value && !langDropdown.value.contains(event.target)) {
        showLangMenu.value = false;
    }
};

// Close mobile menu automatically on route change
watch(
    () => router.currentRoute.value.fullPath,
    () => {
        mobileMenuOpen.value = false;
    }
);

onMounted(() => {
    document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.nav-link {
    @apply text-gray-700 hover:text-primary-600 hover:bg-gray-50 font-medium transition-colors px-3 py-2 rounded-lg text-sm;
}

.nav-link-active {
    @apply text-primary-600 bg-primary-50;
}

.mobile-link {
    @apply block text-gray-700 hover:text-primary-600 hover:bg-gray-50 font-medium transition-colors px-3 py-2.5 rounded-lg text-sm;
}

.mobile-link-active {
    @apply text-primary-600 bg-primary-50;
}
</style>

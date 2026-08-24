<template>
    <div class="home">
        <section class="hero text-white py-20">
            <div class="mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div class="text-center">
                    <h1 class="text-4xl sm:text-5xl font-bold mb-6">
                        <!-- {{ t("home.heroTitle").split("\n")[0] }}<br /> -->
                        <!-- {{ t("home.heroTitle").split("\n")[1] }} -->
                    </h1>
                    <p class="text-xl mb-8 text-blue-50">
                        <!-- {{ t("home.heroSubtitle") }} -->
                    </p>
                    <div class="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                        <router-link to="/helpers"
                            class="btn bg-blue-400 text-white hover:bg-blue-500 px-8 py-3 text-lg font-semibold rounded-lg shadow-md transition">
                            {{ t("nav.findHelpers") }}
                        </router-link>
                        <router-link v-if="!authStore.isAuthenticated" to="/register"
                            class="btn btn-primary px-8 py-3 text-lg font-semibold rounded-lg shadow-md transition">
                            {{ t("home.becomeHelper") }}
                        </router-link>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">
                    {{ t("home.popularCategories") }}
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6" v-if="categoryStore.categories.length > 0">
                    <div v-for="category in categoryStore.categories.slice(0, 12)"" :key="category.id"
                        class="card hover:shadow-xl transition-shadow cursor-pointer"
                        @click="goToCategory(category.name)">
                        <div class="text-center">
                            <div class="text-5xl mb-4">{{ category.icon }}</div>
                            <h3 class="text-xl font-semibold mb-2 text-gray-800">
                                {{ categoryText(category).name }}
                            </h3>
                            <p class="text-gray-600 mb-4">
                                {{ categoryText(category).description }}
                            </p>
                            <p class="text-sm text-primary-600 font-medium">
                                {{ t("home.helpersAvailable", { count: category.helper_count || 0 }) }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-16 bg-gray-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 class="text-3xl font-bold text-center mb-4 text-gray-800">
                    {{ t("home.topRated") }}
                </h2>
                <p class="text-center text-gray-600 mb-12">
                    {{ t("home.trusted") }}
                </p>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div v-for="helper in helperStore.topRatedHelpers" :key="helper.id"
                        class="card hover:shadow-xl transition-shadow cursor-pointer"
                        @click="$router.push(`/helper/${helper.id}`)">
                        <span v-if="!helper.isAvailable" title="Helper is not available currently">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="size-6 text-red-500">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                        </span>
                        <div class="flex flex-col items-center">
                            <img :src="helperAvatarSrc(helper.avatar)" :alt="helper.name"
                                class="w-24 h-24 rounded-full object-cover mb-4 border-4 border-primary-100" />
                            <div class="flex items-center mb-2">
                                <h3 class="text-xl font-semibold text-gray-800">
                                    {{ helper.name }}
                                </h3>
                                <span v-if="helper.verified" class="ml-2 text-blue-500" title="Verified">
                                    ✓
                                </span>
                            </div>
                            <div class="flex items-center mb-3">
                                <span class="text-yellow-400 mr-1">★</span>
                                <span class="font-medium text-gray-800">{{
                                    helper.rating
                                    }}</span>
                                <span class="text-gray-500 text-sm ml-1">({{ helper.reviewCount }})</span>
                            </div>
                            <p class="text-center text-gray-600 text-sm mb-4" v-if="helper.bio">
                                {{ helper.bio.substring(0, 80) }}...
                            </p>
                            <div class="text-center">
                                <p class="text-2xl font-bold text-primary-600">
                                    ₹{{ helper.hourlyRate
                                    }}<span class="text-sm text-gray-500">/hour</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">
                    {{ t("home.whyChoose") }}
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div class="text-center">
                        <div class="text-4xl mb-4">🛡️</div>
                        <h3 class="text-xl font-semibold mb-2 text-gray-800">
                            {{ t("home.verifiedHelpers") }}
                        </h3>
                        <p class="text-gray-600">
                            {{ t("home.verifiedHelpersDes") }}
                        </p>
                    </div>
                    <div class="text-center">
                        <div class="text-4xl mb-4">💰</div>
                        <h3 class="text-xl font-semibold mb-2 text-gray-800">
                            {{ t("home.securePayment") }}
                        </h3>
                        <p class="text-gray-600">
                            {{ t("home.securePaymentsDes") }}
                        </p>
                    </div>
                    <div class="text-center">
                        <div class="text-4xl mb-4">📍</div>
                        <h3 class="text-xl font-semibold mb-2 text-gray-800">
                            {{ t("home.liveTracking") }}
                        </h3>
                        <p class="text-gray-600">
                            {{ t("home.liveTrackingDes") }}
                        </p>
                    </div>
                    <div class="text-center">
                        <div class="text-4xl mb-4">🆘</div>
                        <h3 class="text-xl font-semibold mb-2 text-gray-800">
                            {{ t("home.emergencySOS") }}
                        </h3>
                        <p class="text-gray-600">
                            {{ t("home.emergencySOSDes") }}
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-16 sm:py-20 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
            <div class="max-w-4xl mx-auto px-4 text-center">
                <h2 class="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">{{ authStore.isAuthenticated ?
                    t("home.welcomeBack") : t("home.ready") }}</h2>
                <p class="text-xl mb-8 text-blue-50">
                    {{ authStore.isAuthenticated ? t("home.loggedInPrompt") : t("home.join") }}
                </p>
                <template v-if="!authStore.isAuthenticated">
                    <router-link to="/register" class="btn bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
                        {{ t("home.signUpNow") }}
                    </router-link>
                </template>
                <router-link v-else :to="dashboardPath"
                    class="btn bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
                    {{ t("home.goToDashboard") }}
                </router-link>
            </div>
        </section>

        <footer class="bg-gray-900 text-gray-300">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    <div class="lg:col-span-2">
                        <router-link to="/" class="text-2xl font-bold text-white">TimeBuddy</router-link>
                        <p class="mt-3 max-w-md text-sm leading-6 text-gray-400">{{ t("home.footerDescription") }}</p>
                    </div>
                    <div>
                        <h3 class="font-semibold text-white">{{ t("home.quickLinks") }}</h3>
                        <nav class="mt-3 flex flex-col items-start gap-2 text-sm">
                            <router-link to="/helpers" class="hover:text-white">{{ t("nav.findHelpers") }}</router-link>
                            <router-link v-if="authStore.isAuthenticated" to="/bookings" class="hover:text-white">{{
                                t("nav.bookings") }}</router-link>
                            <router-link v-if="authStore.isAuthenticated" to="/chat" class="hover:text-white">{{
                                t("nav.messages") }}</router-link>
                            <router-link v-else to="/register" class="hover:text-white">{{ t("nav.signUp")
                                }}</router-link>
                        </nav>
                    </div>
                    <div>
                        <h3 class="font-semibold text-white">{{ t("home.contactUs") }}</h3>
                        <p class="mt-3 text-sm text-gray-400">{{ t("home.needHelp") }}</p>
                        <a href="mailto:shekhawatyuvraj339@gmail.com"
                            class="mt-2 inline-block break-all text-sm text-primary-300 hover:text-white">shekhawatyuvraj339@gmail.com</a>
                    </div>
                </div>
                <div class="mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-500 sm:text-left">© {{
                    currentYear
                    }} TimeBuddy. {{ t("home.rightsReserved") }}</div>
            </div>
        </footer>
    </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useHelperStore } from "../stores/helper";
import { helperAvatarSrc } from "../utils/util";
import { useCategoryStore } from "../stores/categories";
import { localizeCategory, useI18n } from "../i18n";

const categoryStore = useCategoryStore();

const router = useRouter();
const authStore = useAuthStore();
const helperStore = useHelperStore();
const { t } = useI18n();
const categoryText = localizeCategory;
const currentYear = new Date().getFullYear();
const dashboardPath = computed(() => authStore.hasRole("helper") ? "/helper-dashboard" : "/dashboard");

onMounted(() => {
    // categoryStore.fetchCategories();
    helperStore.fetchHelpers();
});

const goToCategory = (categoryName) => {
    router.push({
        path: "/helpers",
        query: { category: categoryName },
    });
};
</script>

<style scoped>
.hero {
    min-height: 550px;
    /* Adjusted to fit your 500px-650px range */
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url('../assets/banner.png');
    background-size: cover;
    /* Scales the 1905px image nicely to fit the container */
    background-position: center;
    /* Keeps the center of the graphic focused */
    background-repeat: no-repeat;
    position: relative;
}
</style>

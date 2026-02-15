<template>
    <div class="home">
        <section
            class="hero bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-20"
        >
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center">
                    <h1 class="text-5xl font-bold mb-6">
                        Find Trusted Help<br />
                        For Every Moment
                    </h1>
                    <p class="text-xl mb-8 text-blue-50">
                        Connect with verified helpers for events, errands, elder
                        care, and more
                    </p>
                    <div class="flex justify-center space-x-4">
                        <router-link
                            to="/helpers"
                            class="btn bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
                        >
                            Find Helpers
                        </router-link>
                        <router-link
                            v-if="!authStore.isAuthenticated"
                            to="/register"
                            class="btn bg-blue-700 text-white hover:bg-blue-800 px-8 py-3 text-lg"
                        >
                            Become a Helper
                        </router-link>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">
                    Popular Categories
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div
                        v-for="category in helperStore.categories"
                        :key="category.id"
                        class="card hover:shadow-xl transition-shadow cursor-pointer"
                        @click="goToCategory(category.name)"
                    >
                        <div class="text-center">
                            <div class="text-5xl mb-4">{{ category.icon }}</div>
                            <h3
                                class="text-xl font-semibold mb-2 text-gray-800"
                            >
                                {{ category.name }}
                            </h3>
                            <p class="text-gray-600 mb-4">
                                {{ category.description }}
                            </p>
                            <p class="text-sm text-primary-600 font-medium">
                                {{ category.helperCount }} helpers available
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-16 bg-gray-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 class="text-3xl font-bold text-center mb-4 text-gray-800">
                    Top Rated Helpers
                </h2>
                <p class="text-center text-gray-600 mb-12">
                    Verified professionals trusted by thousands
                </p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div
                        v-for="helper in helperStore.topRatedHelpers"
                        :key="helper.id"
                        class="card hover:shadow-xl transition-shadow cursor-pointer"
                        @click="$router.push(`/helper/${helper.id}`)"
                    >
                        <div class="flex flex-col items-center">
                            <img
                                :src="helper.avatar"
                                :alt="helper.name"
                                class="w-24 h-24 rounded-full object-cover mb-4 border-4 border-primary-100"
                            />
                            <div class="flex items-center mb-2">
                                <h3 class="text-xl font-semibold text-gray-800">
                                    {{ helper.name }}
                                </h3>
                                <span
                                    v-if="helper.verified"
                                    class="ml-2 text-blue-500"
                                    title="Verified"
                                >
                                    ✓
                                </span>
                            </div>
                            <div class="flex items-center mb-3">
                                <span class="text-yellow-400 mr-1">★</span>
                                <span class="font-medium text-gray-800">{{
                                    helper.rating
                                }}</span>
                                <span class="text-gray-500 text-sm ml-1"
                                    >({{ helper.reviewCount }})</span
                                >
                            </div>
                            <p class="text-center text-gray-600 text-sm mb-4">
                                {{ helper.bio.substring(0, 80) }}...
                            </p>
                            <div class="text-center">
                                <p class="text-2xl font-bold text-primary-600">
                                    ₹{{ helper.hourlyRate
                                    }}<span class="text-sm text-gray-500"
                                        >/hour</span
                                    >
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
                    Why Choose TimeBuddy?
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div class="text-center">
                        <div class="text-4xl mb-4">🛡️</div>
                        <h3 class="text-xl font-semibold mb-2 text-gray-800">
                            Verified Helpers
                        </h3>
                        <p class="text-gray-600">
                            All helpers undergo ID and background verification
                        </p>
                    </div>
                    <div class="text-center">
                        <div class="text-4xl mb-4">💰</div>
                        <h3 class="text-xl font-semibold mb-2 text-gray-800">
                            Secure Payments
                        </h3>
                        <p class="text-gray-600">
                            Escrow-based payment system for your protection
                        </p>
                    </div>
                    <div class="text-center">
                        <div class="text-4xl mb-4">📍</div>
                        <h3 class="text-xl font-semibold mb-2 text-gray-800">
                            Live Tracking
                        </h3>
                        <p class="text-gray-600">
                            Track helper location during active jobs
                        </p>
                    </div>
                    <div class="text-center">
                        <div class="text-4xl mb-4">🆘</div>
                        <h3 class="text-xl font-semibold mb-2 text-gray-800">
                            Emergency SOS
                        </h3>
                        <p class="text-gray-600">
                            Instant alert system for safety concerns
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section
            class="py-20 bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
        >
            <div class="max-w-4xl mx-auto px-4 text-center">
                <h2 class="text-4xl font-bold mb-6">Ready to Get Started?</h2>
                <p class="text-xl mb-8 text-blue-50">
                    Join thousands of satisfied customers and helpers
                </p>
                <router-link
                    to="/register"
                    class="btn bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
                >
                    Sign Up Now
                </router-link>
            </div>
        </section>
    </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useHelperStore } from "../stores/helper";

const router = useRouter();
const authStore = useAuthStore();
const helperStore = useHelperStore();

onMounted(() => {
    helperStore.fetchCategories();
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
    min-height: 500px;
    display: flex;
    align-items: center;
}
</style>

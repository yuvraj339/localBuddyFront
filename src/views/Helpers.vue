<template>
    <div class="min-h-screen bg-gray-50 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="mb-8">
                <h1 class="text-4xl font-bold text-gray-900 mb-2">
                    Find Helpers
                </h1>
                <p class="text-gray-600">
                    Browse verified helpers for your needs
                </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <aside class="lg:col-span-1">
                    <div class="card sticky top-20">
                        <h3 class="text-lg font-semibold mb-4 text-gray-800">
                            Filters
                        </h3>

                        <div class="space-y-6">
                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Search
                                </label>
                                <input
                                    v-model="filters.search"
                                    type="text"
                                    class="input"
                                    placeholder="Name or skill..."
                                    @input="applyFilters"
                                />
                            </div>

                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Category
                                </label>
                                <select
                                    v-model="filters.category"
                                    class="input"
                                    @change="applyFilters"
                                >
                                    <option value="">All Categories</option>
                                    <option
                                        v-for="category in helperStore.categories"
                                        :key="category.id"
                                        :value="category.name"
                                    >
                                        {{ category.name }}
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Hourly Rate
                                </label>
                                <div class="grid grid-cols-2 gap-2">
                                    <input
                                        v-model.number="filters.minRate"
                                        type="number"
                                        class="input"
                                        placeholder="Min"
                                        @input="applyFilters"
                                    />
                                    <input
                                        v-model.number="filters.maxRate"
                                        type="number"
                                        class="input"
                                        placeholder="Max"
                                        @input="applyFilters"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Minimum Rating
                                </label>
                                <select
                                    v-model.number="filters.minRating"
                                    class="input"
                                    @change="applyFilters"
                                >
                                    <option :value="null">Any Rating</option>
                                    <option :value="4.5">4.5+ Stars</option>
                                    <option :value="4.0">4.0+ Stars</option>
                                    <option :value="3.5">3.5+ Stars</option>
                                </select>
                            </div>

                            <button
                                @click="clearFilters"
                                class="btn btn-secondary w-full"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </aside>

                <main class="lg:col-span-3">
                    <div v-if="helperStore.loading" class="text-center py-12">
                        <div class="text-lg text-gray-600">
                            Loading helpers...
                        </div>
                    </div>

                    <div
                        v-else-if="helperStore.helpers.length === 0"
                        class="text-center py-12"
                    >
                        <div class="text-6xl mb-4">🔍</div>
                        <div class="text-xl text-gray-600">
                            No helpers found
                        </div>
                        <p class="text-gray-500 mt-2">
                            Try adjusting your filters
                        </p>
                    </div>

                    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div
                            v-for="helper in helperStore.helpers"
                            :key="helper.id"
                            class="card hover:shadow-xl transition-shadow cursor-pointer"
                            @click="$router.push(`/helper/${helper.id}`)"
                        >
                            <div class="flex items-start space-x-4">
                                <img
                                    :src="helper.avatar"
                                    :alt="helper.name"
                                    class="w-20 h-20 rounded-full object-cover border-2 border-primary-100"
                                />
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center mb-1">
                                        <h3
                                            class="text-lg font-semibold text-gray-800 truncate"
                                        >
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
                                    <div
                                        class="flex items-center text-sm text-gray-600 mb-2"
                                    >
                                        <span class="text-yellow-400 mr-1"
                                            >★</span
                                        >
                                        <span class="font-medium">{{
                                            helper.rating
                                        }}</span>
                                        <span class="ml-1"
                                            >({{ helper.reviewCount }})</span
                                        >
                                        <span class="mx-2">•</span>
                                        <span
                                            >{{
                                                helper.completedJobs
                                            }}
                                            jobs</span
                                        >
                                    </div>
                                    <p
                                        class="text-sm text-gray-600 mb-3 line-clamp-2"
                                    >
                                        {{ helper.bio }}
                                    </p>
                                    <div class="flex flex-wrap gap-1 mb-3">
                                        <span
                                            v-for="category in helper.categories.slice(
                                                0,
                                                2
                                            )"
                                            :key="category"
                                            class="badge badge-primary text-xs"
                                        >
                                            {{ category }}
                                        </span>
                                    </div>
                                    <div
                                        class="flex items-center justify-between"
                                    >
                                        <span
                                            class="text-xl font-bold text-primary-600"
                                        >
                                            ₹{{ helper.hourlyRate
                                            }}<span
                                                class="text-sm text-gray-500"
                                                >/hr</span
                                            >
                                        </span>
                                        <span class="text-xs text-gray-500">
                                            ⚡ {{ helper.responseTime }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useHelperStore } from "../stores/helper";

const route = useRoute();
const helperStore = useHelperStore();

const filters = reactive({
    search: "",
    category: "",
    minRate: null,
    maxRate: null,
    minRating: null,
});

onMounted(() => {
    helperStore.fetchCategories();
    helperStore.fetchHelpers();

    if (route.query.category) {
        filters.category = route.query.category;
        applyFilters();
    }
});

watch(
    () => route.query.category,
    (newCategory) => {
        if (newCategory) {
            filters.category = newCategory;
            applyFilters();
        }
    }
);

const applyFilters = () => {
    helperStore.updateFilters(filters);
};

const clearFilters = () => {
    Object.keys(filters).forEach((key) => {
        filters[key] = key === "search" ? "" : null;
    });
    helperStore.clearFilters();
};
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>

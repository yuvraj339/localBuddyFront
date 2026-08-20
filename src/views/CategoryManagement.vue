<template>
    <div class="min-h-screen bg-gray-50 py-8">

        <div class="max-w-6xl mx-auto px-4">
            <div class="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-8">
                <Breadcrumbs :items="breadcrumbItems" />
                <button @click="categoryStore.openCreateModal"
                    class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    + {{ t("categories.add") }}
                </button>
            </div>

            <!-- Loading State -->
            <div v-if="categoryStore.loading" class="text-center py-8">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p class="mt-4 text-gray-600">{{ t("categories.loading") }}</p>
            </div>

            <!-- Error State -->
            <div v-if="categoryStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p class="text-red-700">{{ categoryStore.error }}</p>
            </div>

            <!-- Categories Table -->
            <div v-if="
                !categoryStore.loading &&
                categoryStore.getCategories.length > 0
            " class="bg-white shadow rounded-lg overflow-hidden">
                <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                Icon
                            </th>
                            <th v-for="language in supportedLanguages" :key="language.code" class="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                {{ t("categories.languageName", { language: language.nativeLabel }) }}
                            </th>
                            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                Helpers
                            </th>
                            <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr v-for="category in categoryStore.getCategories" :key="category.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4 text-2xl">
                                {{ category.icon || "🏷️" }}
                            </td>
                            <td v-for="language in supportedLanguages" :key="language.code" class="px-6 py-4 font-medium text-gray-900">
                                {{ category.name_translations?.[language.code] || "—" }}
                            </td>
                            <td class="px-6 py-4 text-gray-600">
                                {{ category.helper_count }}
                            </td>
                            <td class="px-6 py-4 space-x-3">
                                <button @click="
                                    categoryStore.openEditModal(category)
                                    " class="text-blue-600 hover:text-blue-900 text-sm font-medium transition">
                                    Edit
                                </button>
                                <button @click="
                                    categoryStore.deleteCategory(
                                        category.id
                                    )
                                    " class="text-red-600 hover:text-red-900 text-sm font-medium transition">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="
                !categoryStore.loading &&
                categoryStore.getCategories.length === 0
            " class="bg-white shadow rounded-lg p-8 text-center">
                <p class="text-gray-500 text-lg">{{ t("categories.noCategories") }}</p>
                <button @click="categoryStore.openCreateModal"
                    class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    {{ t("categories.createFirst") }}
                </button>
            </div>
        </div>

        <!-- Create/Edit Modal -->
        <div v-if="categoryStore.showModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[calc(100dvh-2rem)] overflow-y-auto p-6">
                <h2 class="text-2xl font-bold mb-4">
                    {{
                        categoryStore.editingCategory
                            ? t("categories.update")
                            : t("categories.create")
                    }}
                </h2>

                <form @submit.prevent="categoryStore.saveCategory()" class="space-y-4">
                    <div v-for="language in supportedLanguages" :key="language.code">
                        <label class="block text-sm font-medium text-gray-700 mb-2">{{ t("categories.languageName", { language: language.nativeLabel }) }}</label>
                        <input v-model="categoryStore.formData.value.name_translations[language.code]" type="text" :required="language.code === 'en'"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Icon (<a href="https://emojidb.org/"
                                target="_blank" class="text-blue-500">Emoji</a>)</label>
                        <input v-model="categoryStore.formData.value.icon" type="text" placeholder="e.g., 👴"
                            maxlength="2"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div v-for="language in supportedLanguages" :key="`${language.code}-description`">
                        <label class="block text-sm font-medium text-gray-700 mb-2">{{ t("categories.languageDescription", { language: language.nativeLabel }) }}</label>
                        <textarea v-model="categoryStore.formData.value.description_translations[language.code]"
                            rows="3"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>

                    <div class="flex gap-3 mt-6">
                        <button type="button" @click="categoryStore.closeModal"
                            class="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
                            {{ t("categories.cancel") }}
                        </button>
                        <button type="submit" :disabled="categoryStore.isSubmitting"
                            class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition">
                            {{
                                categoryStore.isSubmitting
                                    ? "Saving..."
                                    : t("categories.save")
                            }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useCategoryStore } from "../stores/categories";
import Breadcrumbs from "../components/Breadcrumbs.vue";
import { supportedLanguages, useI18n } from "../i18n";
const categoryStore = useCategoryStore();
const { t } = useI18n();

onMounted(() => {
    categoryStore.fetchCategories();
});
const breadcrumbItems = [
    { label: "Home", to: "/", icon: true },
    { label: "Admin", to: "/admin" },
    { label: "Categories" }, // Last item has no 'to' prop and renders as non-clickable
]
</script>

<style scoped>
/* Smooth transitions */
.transition {
    transition: all 0.3s ease;
}
</style>

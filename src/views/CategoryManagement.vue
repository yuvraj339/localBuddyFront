<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="max-w-6xl mx-auto px-4">
            <div class="flex justify-between items-center mb-8">
                <h1 class="text-3xl font-bold text-gray-900">
                    Category Management
                </h1>
                <button
                    @click="categoryStore.openCreateModal"
                    class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    + Add Category
                </button>
            </div>

            <!-- Loading State -->
            <div v-if="categoryStore.loading" class="text-center py-8">
                <div
                    class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
                ></div>
                <p class="mt-4 text-gray-600">Loading categories...</p>
            </div>

            <!-- Error State -->
            <div
                v-if="categoryStore.error"
                class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4"
            >
                <p class="text-red-700">{{ categoryStore.error }}</p>
            </div>

            <!-- Categories Table -->
            <div
                v-if="
                    !categoryStore.loading &&
                    categoryStore.getCategories.length > 0
                "
                class="bg-white shadow rounded-lg overflow-hidden"
            >
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-100">
                        <tr>
                            <th
                                class="px-6 py-3 text-left text-sm font-medium text-gray-700"
                            >
                                Icon
                            </th>
                            <th
                                class="px-6 py-3 text-left text-sm font-medium text-gray-700"
                            >
                                Name
                            </th>
                            <th
                                class="px-6 py-3 text-left text-sm font-medium text-gray-700"
                            >
                                Description
                            </th>
                            <th
                                class="px-6 py-3 text-left text-sm font-medium text-gray-700"
                            >
                                Helpers
                            </th>
                            <th
                                class="px-6 py-3 text-left text-sm font-medium text-gray-700"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr
                            v-for="category in categoryStore.getCategories"
                            :key="category.id"
                            class="hover:bg-gray-50"
                        >
                            <td class="px-6 py-4 text-2xl">
                                {{ category.icon || "🏷️" }}
                            </td>
                            <td class="px-6 py-4 font-medium text-gray-900">
                                {{ category.name }}
                            </td>
                            <td class="px-6 py-4 text-gray-600 text-sm">
                                {{ category.description || "-" }}
                            </td>
                            <td class="px-6 py-4 text-gray-600">
                                {{ category.helper_count }}
                            </td>
                            <td class="px-6 py-4 space-x-3">
                                <button
                                    @click="
                                        categoryStore.openEditModal(category)
                                    "
                                    class="text-blue-600 hover:text-blue-900 text-sm font-medium transition"
                                >
                                    Edit
                                </button>
                                <button
                                    @click="
                                        categoryStore.deleteCategory(
                                            category.id,
                                        )
                                    "
                                    class="text-red-600 hover:text-red-900 text-sm font-medium transition"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Empty State -->
            <div
                v-if="
                    !categoryStore.loading &&
                    categoryStore.getCategories.length === 0
                "
                class="bg-white shadow rounded-lg p-8 text-center"
            >
                <p class="text-gray-500 text-lg">No categories found</p>
                <button
                    @click="categoryStore.openCreateModal"
                    class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Create your first category
                </button>
            </div>
        </div>

        <!-- Create/Edit Modal -->
        <div
            v-if="categoryStore.showModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
            <div class="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
                <h2 class="text-2xl font-bold mb-4">
                    {{
                        categoryStore.editingCategory
                            ? "Edit Category"
                            : "Create Category"
                    }}
                </h2>

                <form
                    @submit.prevent="categoryStore.saveCategory()"
                    class="space-y-4"
                >
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-2"
                            >Category Name</label
                        >
                        <input
                            v-model="categoryStore.formData.value.name"
                            type="text"
                            placeholder="e.g., Elder Care"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-2"
                            >Icon (Emoji)</label
                        >
                        <input
                            v-model="categoryStore.formData.value.icon"
                            type="text"
                            placeholder="e.g., 👴"
                            maxlength="2"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-2"
                            >Description</label
                        >
                        <textarea
                            v-model="categoryStore.formData.value.description"
                            placeholder="Short description of the category"
                            rows="3"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                    </div>

                    <div class="flex gap-3 mt-6">
                        <button
                            type="button"
                            @click="categoryStore.closeModal"
                            class="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            :disabled="categoryStore.isSubmitting"
                            class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition"
                        >
                            {{
                                categoryStore.isSubmitting
                                    ? "Saving..."
                                    : "Save"
                            }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCategoryStore } from "../stores/categories";

const categoryStore = useCategoryStore();

onMounted(() => {
    categoryStore.fetchCategories();
});
</script>

<style scoped>
/* Smooth transitions */
.transition {
    transition: all 0.3s ease;
}
</style>

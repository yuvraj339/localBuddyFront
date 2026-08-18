import { defineStore } from "pinia";
import { api } from "../services/api";
import { ref } from "vue";

export const useCategoryStore = defineStore("categories", {
    state: () => ({
        categories: [],
        token: localStorage.getItem("token") || null,
        loading: false,
        error: null,
        isSubmitting: false,
        editingCategory: null,
        showModal: false,
        formData: ref({
            name: "",
            icon: "",
            description: "",
            name_translations: { en: "", hi: "" },
            description_translations: { en: "", hi: "" },
        }),
    }),

    getters: {
        getCategories: (state) => state.categories || [],
    },

    actions: {
        openCreateModal() {
            this.editingCategory = null;
            this.formData.value = {
                name: "",
                icon: "",
                description: "",
                name_translations: { en: "", hi: "" },
                description_translations: { en: "", hi: "" },
            };
            this.showModal = true;
        },
        openEditModal(category) {
            this.editingCategory = category;
            this.formData.value = {
                name: category.name,
                icon: category.icon || "",
                description: category.description || "",
                name_translations: { en: category.name, hi: "", ...(category.name_translations || {}) },
                description_translations: { en: category.description || "", hi: "", ...(category.description_translations || {}) },
            };
            this.showModal = true;
        },
        closeModal() {
            this.editingCategory = null;
            this.showModal = false;
            this.formData.value = {
                name: "",
                icon: "",
                description: "",
                name_translations: { en: "", hi: "" },
                description_translations: { en: "", hi: "" },
            };
        },
        async fetchCategories() {
            try {
                this.loading = true;
                this.error = null;
                const response = await api.getCategories();

                if (response.success) {
                    this.categories = response.data;
                } else {
                    this.error = response.error || "Failed to load categories";
                }
            } catch (e) {
                this.error = "Error loading categories";
                console.error(e);
            } finally {
                this.loading = false;
            }
        },
        async saveCategory() {
            try {
                this.isSubmitting = true;
                this.error = null;

                const headers = {
                    "Content-Type": "application/json",
                    ...(this.token
                        ? { Authorization: `Bearer ${this.token}` }
                        : {}),
                };

                let response;
                const payload = {
                    ...this.formData.value,
                    name: this.formData.value.name_translations.en.trim(),
                    description: this.formData.value.description_translations.en.trim() || null,
                };
                if (this.editingCategory) {
                    // Update existing category
                    response = await fetch(
                        `${
                            import.meta.env.VITE_API_BASE ||
                            "http://localhost:8000"
                        }/api/v1/categories/${this.editingCategory.id}`,
                        {
                            method: "PUT",
                            headers,
                            body: JSON.stringify(payload),
                        }
                    );
                } else {
                    // Create new category
                    response = await fetch(
                        `${
                            import.meta.env.VITE_API_BASE ||
                            "http://localhost:8000"
                        }/api/v1/categories`,
                        {
                            method: "POST",
                            headers,
                            body: JSON.stringify(payload),
                        }
                    );
                }

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || "Failed to save category");
                }

                this.closeModal();
                await this.fetchCategories();
            } catch (e) {
                this.error = e.message || "Error saving category";
                console.error(e);
            } finally {
                this.isSubmitting = false;
            }
        },
        async deleteCategory(categoryId) {
            try {
                const response = await fetch(
                    `${
                        import.meta.env.VITE_API_BASE || "http://localhost:8000"
                    }/api/v1/categories/${categoryId}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${this.token}`,
                        },
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(
                        errorData.detail || "Failed to delete category"
                    );
                }

                await this.fetchCategories();
            } catch (e) {
                this.error = e.message || "Error deleting category";
                console.error(e);
            }
        },
        async updateCategoryHelperCount(categoryName, countChange) {
            try {
                const category = this.categories.find(
                    (cat) => cat.name === categoryName
                );
                if (!category) return;

                const response = await fetch(
                    `${
                        import.meta.env.VITE_API_BASE || "http://localhost:8000"
                    }/api/v1/categories/${category.id}/update-helper-count`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${this.token}`,
                        },
                        body: JSON.stringify({ count_change: countChange }),
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(
                        errorData.detail || "Failed to update helper count"
                    );
                }

                // Update local category helper count
                category.helper_count += countChange;
            } catch (e) {
                console.error("Error updating category helper count:", e);
            }
        },
    },
});

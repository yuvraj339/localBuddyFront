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
            };
            this.showModal = true;
        },
        openEditModal(category) {
            this.editingCategory = category;
            this.formData.value = {
                name: category.name,
                icon: category.icon || "",
                description: category.description || "",
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
            };
        },
        async fetchCategories() {
            let categories = JSON.parse(localStorage.getItem("categories"));

            if (categories && categories.length) {
                this.categories = categories;
                return;
            }
            try {
                this.loading = true;
                this.error = null;
                const response = await api.getCategories();

                if (response.success) {
                    this.categories = response.data;
                    localStorage.setItem(
                        "categories",
                        JSON.stringify(this.categories)
                    );
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
                            body: JSON.stringify(this.formData.value),
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
                            body: JSON.stringify(this.formData.value),
                        }
                    );
                }

                if (!response.ok) {
                    const errorData = await response.json();
                    // throw new Error(errorData.detail || "Failed to save category");
                    this.error = errorData.detail || "Failed to save category";
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
    },
});

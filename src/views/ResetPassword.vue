<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="card w-full max-w-md">
            <div class="mb-8 text-center">
                <h1 class="text-3xl font-bold text-gray-900">{{ t("auth.setNewPasswordTitle") }}</h1>
                <p class="mt-2 text-gray-600">{{ t("auth.chooseNewPasswordDesc") }}</p>
            </div>

            <form v-if="!successMessage" class="space-y-5" @submit.prevent="handleSubmit">
                <div v-if="errorMessage" class="rounded-lg border-r-2 bg-red-100 p-3 text-sm text-red-700">{{
                    errorMessage }}</div>
                <div>
                    <label for="new-password" class="mb-2 block text-sm font-medium text-gray-700">{{
                        t("auth.newPasswordLabel") }}</label>
                    <input id="new-password" v-model="password" type="password" required minlength="8"
                        autocomplete="new-password" class="input" :placeholder="t('auth.passwordHint')" />
                </div>
                <div>
                    <label for="confirm-password" class="mb-2 block text-sm font-medium text-gray-700">{{
                        t("auth.confirmNewPasswordLabel") }}</label>
                    <input id="confirm-password" v-model="confirmPassword" type="password" required minlength="8"
                        autocomplete="new-password" class="input" :placeholder="t('auth.confirmPasswordPlaceholder')" />
                </div>
                <button type="submit" :disabled="loading || !token" class="btn btn-primary w-full py-3">
                    {{ loading ? "Updating password..." : t("auth.resetPasswordBtn") }}
                </button>
                <p v-if="!token" class="text-center text-sm text-red-600">This reset link is missing or invalid.</p>
            </form>

            <div v-else class="text-center">
                <div class="rounded-lg bg-green-100 p-3 text-sm text-green-700">{{ successMessage }}</div>
                <router-link to="/login" class="btn btn-primary mt-6 inline-block">Back to sign in</router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "../i18n";
import { api } from "../services/api";

const { t } = useI18n();
const route = useRoute();
const token = typeof route.query.token === "string" ? route.query.token : "";
const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const handleSubmit = async () => {
    errorMessage.value = "";
    if (password.value !== confirmPassword.value) {
        errorMessage.value = "Passwords do not match.";
        return;
    }

    loading.value = true;
    const response = await api.resetPassword(token, password.value);
    loading.value = false;

    if (response.success) {
        successMessage.value = response.message;
    } else {
        errorMessage.value = response.error;
    }
};
</script>

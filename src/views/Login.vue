<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full">
            <div class="card">
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-bold text-gray-900">
                        {{ t("auth.welcomeBack") }}
                    </h2>
                    <p class="text-gray-600 mt-2">{{ t("auth.signInAccount") }}</p>
                </div>

                <form @submit.prevent="handleLogin" class="space-y-6">
                    <div v-if="authStore.error" class="bg-red-100 text-red-700 p-3 border-r-2 rounded-lg text-sm">
                        {{ authStore.error }}
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            {{ t("auth.emailAddress") }}
                        </label>
                        <input v-model="form.email" type="email" required class="input" placeholder="you@example.com" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            {{ t("auth.password") }}
                        </label>
                        <input v-model="form.password" type="password" required class="input"
                            placeholder="Enter your password" />
                    </div>

                    <div class="flex items-center justify-between">
                        <label class="flex items-center">
                            <input v-model="form.remember" type="checkbox"
                                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                            <span class="ml-2 text-sm text-gray-700">{{ t("auth.rememberMe") }}</span>
                        </label>
                        <button type="button" @click="openForgotPassword"
                            class="text-sm text-primary-600 hover:text-primary-700">
                            {{ t("auth.forgotPassword") }}
                        </button>
                    </div>

                    <button type="submit" :disabled="authStore.loading" class="btn btn-primary w-full py-3">
                        {{ authStore.loading ? "Signing in..." : t("auth.signIn") }}
                    </button>
                </form>

                <!-- <div class="mt-6">
                    <div class="relative">
                        <div class="absolute inset-0 flex items-center">
                            <div class="w-full border-t border-gray-300"></div>
                        </div>
                        <div class="relative flex justify-center text-sm">
                            <span class="px-2 bg-white text-gray-500"
                                >Quick Login for Demo</span
                            >
                        </div>
                    </div>

                    <div class="mt-6 space-y-3">
                        <button
                            @click="quickLogin('customer')"
                            class="btn btn-secondary w-full"
                        >
                            Login as Customer
                        </button>
                        <button
                            @click="quickLogin('helper')"
                            class="btn btn-secondary w-full"
                        >
                            Login as Helper
                        </button>
                    </div>
                </div> -->

                <div class="mt-6 text-center">
                    <p class="text-sm text-gray-600">
                        {{ t("auth.noAccount") }}
                        <router-link to="/register" class="text-primary-600 hover:text-primary-700 font-medium">
                            {{ t("nav.signUp") }}
                        </router-link>
                    </p>
                </div>
            </div>

            <div v-if="showForgotPassword"
                class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 px-4"
                @click.self="closeForgotPassword">
                <div class="card w-full max-w-md" role="dialog" aria-modal="true"
                    aria-labelledby="forgot-password-title">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <h3 id="forgot-password-title" class="text-xl font-bold text-gray-900">{{
                                t("auth.resetYourPassword") }}</h3>
                            <p class="mt-2 text-sm text-gray-600">{{ t("auth.enterEmailInstructions") }}</p>
                        </div>
                        <button type="button" class="text-2xl leading-none text-gray-400 hover:text-gray-600"
                            aria-label="Close" @click="closeForgotPassword">&times;</button>
                    </div>

                    <form class="mt-6 space-y-4" @submit.prevent="handleForgotPassword">
                        <div v-if="forgotPasswordError"
                            class="rounded-lg border-r-2 bg-red-100 p-3 text-sm text-red-700">
                            {{ forgotPasswordError }}
                        </div>
                        <div v-if="forgotPasswordMessage"
                            class="rounded-lg border-r-2 bg-green-100 p-3 text-sm text-green-700">
                            {{ t("auth.resetInstructionsSent") }}
                        </div>
                        <div>
                            <label for="reset-email" class="mb-2 block text-sm font-medium text-gray-700">{{
                                t("auth.emailAddress") }}</label>
                            <input id="reset-email" v-model="forgotPasswordEmail" type="email" required
                                autocomplete="email" class="input" placeholder="you@example.com" />
                        </div>
                        <button type="submit" :disabled="forgotPasswordLoading" class="btn btn-primary w-full py-3">
                            {{ forgotPasswordLoading ? "Sending instructions..." : t("auth.sendInstructionsBtn") }}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useI18n } from "../i18n";
import { api } from "../services/api";

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const showForgotPassword = ref(false);
const forgotPasswordEmail = ref("");
const forgotPasswordLoading = ref(false);
const forgotPasswordError = ref("");
const forgotPasswordMessage = ref("");

const form = reactive({
    email: "",
    password: "",
    remember: false,
});

const handleLogin = async () => {
    const success = await authStore.login(form.email, form.password);

    if (success) {
        if (authStore.isHelper) {
            router.push("/helper-dashboard");
        } else {
            router.push("/dashboard");
        }
    }
};

const openForgotPassword = () => {
    forgotPasswordEmail.value = form.email;
    forgotPasswordError.value = "";
    forgotPasswordMessage.value = "";
    showForgotPassword.value = true;
};

const closeForgotPassword = () => {
    showForgotPassword.value = false;
};

const handleForgotPassword = async () => {
    forgotPasswordLoading.value = true;
    forgotPasswordError.value = "";
    forgotPasswordMessage.value = "";

    const response = await api.requestPasswordReset(forgotPasswordEmail.value);
    if (response.success) {
        forgotPasswordMessage.value = response.message;
    } else {
        forgotPasswordError.value = response.error;
    }
    forgotPasswordLoading.value = false;
};

const quickLogin = async (role) => {
    const email = role === "helper" ? "helper@test.com" : "customer@test.com";
    const success = await authStore.login(email, "password");

    if (success) {
        if (role === "helper") {
            router.push("/helper-dashboard");
        } else {
            router.push("/dashboard");
        }
    }
};
</script>

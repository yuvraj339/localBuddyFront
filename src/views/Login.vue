<template>
    <div
        class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
        <div class="max-w-md w-full">
            <div class="card">
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-bold text-gray-900">
                        Welcome Back
                    </h2>
                    <p class="text-gray-600 mt-2">Sign in to your account</p>
                </div>

                <form @submit.prevent="handleLogin" class="space-y-6">
                    <div
                        v-if="authStore.error"
                        class="bg-red-100 text-red-700 p-3 border-r-2 rounded-lg text-sm"
                    >
                        {{ authStore.error }}
                    </div>

                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Email Address
                        </label>
                        <input
                            v-model="form.email"
                            type="email"
                            required
                            class="input"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Password
                        </label>
                        <input
                            v-model="form.password"
                            type="password"
                            required
                            class="input"
                            placeholder="Enter your password"
                        />
                    </div>

                    <div class="flex items-center justify-between">
                        <label class="flex items-center">
                            <input
                                v-model="form.remember"
                                type="checkbox"
                                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <span class="ml-2 text-sm text-gray-700"
                                >Remember me</span
                            >
                        </label>
                        <a
                            href="#"
                            class="text-sm text-primary-600 hover:text-primary-700"
                        >
                            Forgot password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        :disabled="authStore.loading"
                        class="btn btn-primary w-full py-3"
                    >
                        {{ authStore.loading ? "Signing in..." : "Sign In" }}
                    </button>
                </form>

                <div class="mt-6">
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
                </div>

                <div class="mt-6 text-center">
                    <p class="text-sm text-gray-600">
                        Don't have an account?
                        <router-link
                            to="/register"
                            class="text-primary-600 hover:text-primary-700 font-medium"
                        >
                            Sign up
                        </router-link>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const authStore = useAuthStore();

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

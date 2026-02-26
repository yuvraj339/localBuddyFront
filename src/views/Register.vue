<template>
    <div
        class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
        <div class="max-w-md w-full">
            <div class="card">
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-bold text-gray-900">
                        Create Account
                    </h2>
                    <p class="text-gray-600 mt-2">Join TimeBuddy today</p>
                </div>

                <form @submit.prevent="handleRegister" class="space-y-6">
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
                            I want to
                        </label>
                        <div class="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                @click="form.role = 'customer'"
                                :class="[
                                    'p-4 rounded-lg border-2 transition-all',
                                    form.role === 'customer'
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-gray-200 hover:border-gray-300',
                                ]"
                            >
                                <div class="text-2xl mb-2">👤</div>
                                <div class="font-medium">Find Help</div>
                            </button>
                            <button
                                type="button"
                                @click="form.role = 'helper'"
                                :class="[
                                    'p-4 rounded-lg border-2 transition-all',
                                    form.role === 'helper'
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-gray-200 hover:border-gray-300',
                                ]"
                            >
                                <div class="text-2xl mb-2">🙋</div>
                                <div class="font-medium">Offer Help</div>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Full Name
                        </label>
                        <input
                            v-model="form.full_name"
                            type="text"
                            required
                            class="input"
                            placeholder="Enter your name"
                        />
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
                            Phone Number
                        </label>
                        <input
                            v-model="form.phone"
                            type="tel"
                            required
                            class="input"
                            placeholder="+91 98765 43210"
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
                            placeholder="Create a password"
                        />
                    </div>

                    <div>
                        <label class="flex items-start">
                            <input
                                v-model="form_valid.agreeToTerms"
                                type="checkbox"
                                required
                                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                            />
                            <span class="ml-2 text-sm text-gray-700">
                                I agree to the Terms of Service and Privacy
                                Policy
                            </span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        :disabled="authStore.loading"
                        class="btn btn-primary w-full py-3"
                    >
                        {{
                            authStore.loading
                                ? "Creating account..."
                                : "Create Account"
                        }}
                    </button>
                </form>

                <div class="mt-6 text-center">
                    <p class="text-sm text-gray-600">
                        Already have an account?
                        <router-link
                            to="/login"
                            class="text-primary-600 hover:text-primary-700 font-medium"
                        >
                            Sign in
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
    full_name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer",
});

const form_valid = reactive({
    agreeToTerms: false,
});

const handleRegister = async () => {
    const success = await authStore.register(form);

    if (success) {
        if (form.role === "helper") {
            router.push("/helper-dashboard");
        } else {
            router.push("/dashboard");
        }
    }
};
</script>

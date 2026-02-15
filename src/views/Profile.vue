<template>
    <div class="min-h-screen bg-gray-50 py-12">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">
                    My Profile
                </h1>
                <p class="text-gray-600">Manage your account information</p>
            </div>

            <div class="space-y-6">
                <div class="card">
                    <div class="flex items-center space-x-6 mb-6">
                        <img
                            :src="authStore.user?.avatar"
                            :alt="authStore.user?.name"
                            class="w-24 h-24 rounded-full object-cover border-4 border-primary-100"
                        />
                        <div>
                            <button class="btn btn-primary text-sm mb-2">
                                Change Photo
                            </button>
                            <p class="text-xs text-gray-600">
                                JPG, PNG or GIF. Max size 2MB
                            </p>
                        </div>
                    </div>

                    <form @submit.prevent="updateProfile" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Full Name
                                </label>
                                <input
                                    v-model="profileForm.name"
                                    type="text"
                                    class="input"
                                />
                            </div>

                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Email Address
                                </label>
                                <input
                                    v-model="profileForm.email"
                                    type="email"
                                    class="input"
                                />
                            </div>

                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Phone Number
                                </label>
                                <input
                                    v-model="profileForm.phone"
                                    type="tel"
                                    class="input"
                                />
                            </div>

                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Member Since
                                </label>
                                <input
                                    :value="
                                        formatDate(authStore.user?.memberSince)
                                    "
                                    type="text"
                                    class="input"
                                    disabled
                                />
                            </div>
                        </div>

                        <div v-if="authStore.isHelper">
                            <label
                                class="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Bio
                            </label>
                            <textarea
                                v-model="profileForm.bio"
                                rows="4"
                                class="input"
                                placeholder="Tell customers about yourself..."
                            ></textarea>
                        </div>

                        <div class="flex justify-end">
                            <button type="submit" class="btn btn-primary">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>

                <div class="card">
                    <h2 class="text-xl font-semibold mb-6 text-gray-900">
                        Verification Status
                    </h2>

                    <div class="space-y-4">
                        <div
                            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                            <div class="flex items-center space-x-3">
                                <div
                                    class="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center"
                                >
                                    ✓
                                </div>
                                <div>
                                    <div class="font-medium text-gray-900">
                                        Email Verified
                                    </div>
                                    <div class="text-sm text-gray-600">
                                        {authStore.user?.email}
                                    </div>
                                </div>
                            </div>
                            <span class="badge badge-success">Verified</span>
                        </div>

                        <div
                            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                            <div class="flex items-center space-x-3">
                                <div
                                    class="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center"
                                >
                                    ✓
                                </div>
                                <div>
                                    <div class="font-medium text-gray-900">
                                        Phone Verified
                                    </div>
                                    <div class="text-sm text-gray-600">
                                        {authStore.user?.phone}
                                    </div>
                                </div>
                            </div>
                            <span class="badge badge-success">Verified</span>
                        </div>

                        <div
                            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                            <div class="flex items-center space-x-3">
                                <div
                                    class="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center"
                                >
                                    ✓
                                </div>
                                <div>
                                    <div class="font-medium text-gray-900">
                                        Government ID
                                    </div>
                                    <div class="text-sm text-gray-600">
                                        Aadhaar verified
                                    </div>
                                </div>
                            </div>
                            <span class="badge badge-success">Verified</span>
                        </div>
                    </div>
                </div>

                <div v-if="authStore.isHelper" class="card">
                    <h2 class="text-xl font-semibold mb-6 text-gray-900">
                        Helper Settings
                    </h2>

                    <div class="space-y-6">
                        <div>
                            <label
                                class="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Hourly Rate (₹)
                            </label>
                            <input
                                v-model.number="profileForm.hourlyRate"
                                type="number"
                                min="100"
                                class="input"
                            />
                        </div>

                        <div>
                            <label
                                class="block text-sm font-medium text-gray-700 mb-4"
                            >
                                Service Categories
                            </label>
                            <div class="grid grid-cols-2 gap-3">
                                <label
                                    v-for="category in availableCategories"
                                    :key="category"
                                    class="flex items-center space-x-2"
                                >
                                    <input
                                        type="checkbox"
                                        :checked="
                                            profileForm.categories?.includes(
                                                category
                                            )
                                        "
                                        @change="toggleCategory(category)"
                                        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                    />
                                    <span class="text-sm text-gray-700">{{
                                        category
                                    }}</span>
                                </label>
                            </div>
                        </div>

                        <div class="flex justify-end">
                            <button
                                @click="updateProfile"
                                class="btn btn-primary"
                            >
                                Save Settings
                            </button>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <h2 class="text-xl font-semibold mb-6 text-gray-900">
                        Security
                    </h2>

                    <form @submit.prevent="updatePassword" class="space-y-6">
                        <div>
                            <label
                                class="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Current Password
                            </label>
                            <input
                                v-model="passwordForm.current"
                                type="password"
                                class="input"
                            />
                        </div>

                        <div>
                            <label
                                class="block text-sm font-medium text-gray-700 mb-2"
                            >
                                New Password
                            </label>
                            <input
                                v-model="passwordForm.new"
                                type="password"
                                class="input"
                            />
                        </div>

                        <div>
                            <label
                                class="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Confirm New Password
                            </label>
                            <input
                                v-model="passwordForm.confirm"
                                type="password"
                                class="input"
                            />
                        </div>

                        <div class="flex justify-end">
                            <button type="submit" class="btn btn-primary">
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>

                <div class="card border-danger-200">
                    <h2 class="text-xl font-semibold mb-4 text-danger-600">
                        Danger Zone
                    </h2>
                    <p class="text-gray-600 mb-4">
                        Once you delete your account, there is no going back.
                        Please be certain.
                    </p>
                    <button class="btn btn-danger">Delete Account</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive } from "vue";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();

const profileForm = reactive({
    name: authStore.user?.name || "",
    email: authStore.user?.email || "",
    phone: authStore.user?.phone || "",
    bio: authStore.user?.bio || "",
    hourlyRate: 250,
    categories: ["Elder Care", "Event Support"],
});

const passwordForm = reactive({
    current: "",
    new: "",
    confirm: "",
});

const availableCategories = [
    "Elder Care",
    "Event Support",
    "Home Functions",
    "Errands",
    "Companionship",
    "Pet Care",
];

const updateProfile = () => {
    alert("Profile updated successfully!");
};

const updatePassword = () => {
    if (passwordForm.new !== passwordForm.confirm) {
        alert("Passwords do not match!");
        return;
    }
    alert("Password updated successfully!");
    passwordForm.current = "";
    passwordForm.new = "";
    passwordForm.confirm = "";
};

const toggleCategory = (category) => {
    const index = profileForm.categories.indexOf(category);
    if (index > -1) {
        profileForm.categories.splice(index, 1);
    } else {
        profileForm.categories.push(category);
    }
};

const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};
</script>

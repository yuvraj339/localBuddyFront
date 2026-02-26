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
                            :src="avatarSrc"
                            :alt="authStore.user?.full_name"
                            class="w-24 h-24 rounded-full object-cover border-4 border-primary-100"
                        />
                        <div>
                            <input
                                type="file"
                                ref="avatarInput"
                                accept="image/*"
                                class="hidden"
                                @change="onAvatarChange"
                            />
                            <button
                                class="btn btn-primary text-sm mb-2"
                                @click.prevent="triggerAvatarInput"
                            >
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
                                    v-model="profileForm.full_name"
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
                                        formatDate(authStore.user?.created_at)
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
                                        {{ authStore.user?.email }}
                                    </div>
                                </div>
                            </div>
                            <span
                                :class="[
                                    'badge',
                                    authStore.user?.email_verified
                                        ? 'badge-success'
                                        : 'badge-warning',
                                ]"
                            >
                                {{
                                    authStore.user?.email_verified
                                        ? "Verified"
                                        : "Not Verified"
                                }}
                            </span>
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
                                        {{ authStore.user?.phone }}
                                    </div>
                                </div>
                            </div>
                            <span
                                :class="[
                                    'badge',
                                    authStore.user?.phone_verified
                                        ? 'badge-success'
                                        : 'badge-warning',
                                ]"
                            >
                                {{
                                    authStore.user?.phone_verified
                                        ? "Verified"
                                        : "Not Verified"
                                }}
                            </span>
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
                            <span
                                :class="[
                                    'badge',
                                    authStore.user?.government_id_verified
                                        ? 'badge-success'
                                        : 'badge-warning',
                                ]"
                            >
                                {{
                                    authStore.user?.government_id_verified
                                        ? "Verified"
                                        : "Not Verified"
                                }}
                            </span>
                        </div>
                        <div class="flex justify-end mt-4">
                            <button
                                class="btn btn-primary"
                                @click="updateVerificationStatus"
                            >
                                Update Verification Status
                            </button>
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
                                v-model.number="profileForm.hourly_rate"
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
                                                category,
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
                        <div
                            v-if="passwordError"
                            class="text-danger-600 text-sm mt-2"
                        >
                            {{ passwordError }}
                        </div>
                        <div
                            v-if="passwordSuccess"
                            class="text-success-600 text-sm mt-2"
                        >
                            {{ passwordSuccess }}
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
                    <button class="btn btn-danger" @click="deleteAccount">
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from "vue";
import { useAuthStore } from "../stores/auth";
import { api } from "../services/api";

const authStore = useAuthStore();
const loading = ref(false);
const error = ref("");
const avatarInput = ref(null);
const newAvatarURL = ref(null);
const passwordError = ref("");
const passwordSuccess = ref("");
const triggerAvatarInput = () => {
    avatarInput.value && avatarInput.value.click();
};

const onAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
        alert("Only JPG, PNG, or GIF files are allowed.");
        return;
    }
    if (file.size > 2 * 1024 * 1024) {
        alert("Max file size is 2MB.");
        return;
    }
    loading.value = true;
    const resp = await api.uploadAvatar(file);
    if (resp.success) {
        newAvatarURL.value = resp.data;
        alert("Photo updated!");
    } else {
        alert(resp.error || "Failed to update photo");
    }
    loading.value = false;
};

const profileForm = reactive({
    full_name: "",
    email: "",
    phone: "",
    bio: "",
    hourly_rate: 0,
    categories: [],
    is_active: false,
    is_verified: false,
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

const fetchProfile = async () => {
    loading.value = true;
    error.value = "";
    if (authStore.user?.email) {
        updateProfileForm(authStore.user);
    } else {
        const resp = await api.getUserProfile();
        if (resp.success) {
            authStore.user = resp.data;
            updateProfileForm(authStore.user);
        } else {
            error.value = resp.error || "Failed to load profile";
        }
    }
    loading.value = false;
};

const updateProfileForm = (user) => {
    profileForm.full_name = user.full_name || "";
    profileForm.email = user.email || "";
    profileForm.phone = user.phone || "";
    profileForm.bio = user.bio || "";
    profileForm.hourly_rate = user.hourly_rate || 250;
    profileForm.categories = user.categories || [];
    profileForm.is_active = user.is_active || false;
    profileForm.is_verified = user.is_verified || false;
};
onMounted(fetchProfile);

const avatarSrc = computed(() => {
    const baseUrl = "http://localhost:8000";
    const avatarUrl = newAvatarURL.value || authStore.user?.avatar_url;

    // If avatar_url exists, prepend base URL
    if (avatarUrl) {
        return `${baseUrl}${avatarUrl}`;
    }

    // Fallback to default avatar
    return `${baseUrl}/default-avatar.png`;
}); // refetch profile when user data changes
const updateProfile = async () => {
    loading.value = true;
    error.value = "";
    const resp = await api.updateProfile({
        full_name: profileForm.full_name,
        email: profileForm.email,
        phone: profileForm.phone,
        bio: profileForm.bio,
        hourly_rate: profileForm.hourly_rate,
        categories: profileForm.categories,
        is_active: profileForm.is_active,
        is_verified: profileForm.is_verified,
    });
    if (resp.success) {
        authStore.user = resp.data;
        alert("Profile updated successfully!");
    } else {
        error.value = resp.error || "Failed to update profile";
    }
    loading.value = false;
};

const updatePassword = async () => {
    passwordError.value = "";
    passwordSuccess.value = "";
    if (passwordForm.new !== passwordForm.confirm) {
        passwordError.value = "Passwords do not match!";
        return;
    }
    loading.value = true;
    const resp = await api.updatePassword(
        passwordForm.current,
        passwordForm.new,
    );
    if (resp.success) {
        passwordSuccess.value = "Password updated successfully!";
        passwordForm.current = "";
        passwordForm.new = "";
        passwordForm.confirm = "";
    } else {
        passwordError.value = resp.error || "Failed to update password";
    }
    loading.value = false;
};
const updateVerificationStatus = async () => {
    loading.value = true;
    const resp = await api.updateVerification(
        !!authStore.user?.email_verified,
        !!authStore.user?.phone_verified,
    );
    if (resp.success) {
        authStore.user = resp.data;
        alert("Verification status updated!");
    } else {
        alert(resp.error || "Failed to update verification status");
    }
    loading.value = false;
};

const deleteAccount = async () => {
    if (
        !confirm(
            "Are you sure you want to delete your account? This cannot be undone.",
        )
    )
        return;
    loading.value = true;
    const resp = await api.softDeleteAccount();
    if (resp.success) {
        alert("Account deleted. You will be logged out.");
        localStorage.removeItem("token");
        window.location.href = "/login";
    } else {
        alert(resp.error || "Failed to delete account");
    }
    loading.value = false;
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

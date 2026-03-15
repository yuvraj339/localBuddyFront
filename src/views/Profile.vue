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
                            :src="avatarSrc(authStore.user?.avatar_url)"
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

                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Location
                                </label>
                                <input
                                    v-model="profileForm.location"
                                    type="text"
                                    class="input"
                                    placeholder="Your city/area"
                                />
                            </div>
                        </div>

                        <div v-if="authStore.hasRole('helper')">
                            <div>
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
                            <!-- <div
                                v-if="authStore.hasRole('helper')"
                                class="card"
                            > -->
                            <!-- <h2
                                    class="text-xl font-semibold mb-6 text-gray-900"
                                >
                                    Category Settings
                                </h2> -->

                            <!-- <div class="space-y-6"> -->
                            <div class="mt-4">
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-2"
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
                            <!-- </div> -->
                            <!-- </div> -->
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
                        Roles & Permissions
                    </h2>
                    <div class="space-y-4 mb-3">
                        <div class="font-medium text-gray-800 mb-1">Roles:</div>
                        <div v-if="authStore.roles.length > 0">
                            <span
                                v-for="role in authStore.roles"
                                :key="role"
                                class="badge badge-primary mr-2 capitalize"
                                >{{ role.name }}
                            </span>
                        </div>
                        <div v-else class="text-gray-500">
                            No roles assigned.
                        </div>
                    </div>
                    <div>
                        <div class="font-medium text-gray-800 mb-1">
                            Permissions:
                        </div>
                        <div
                            v-if="authStore.permissions"
                            class="flex flex-wrap gap-3 mt-2"
                        >
                            <span
                                v-for="perm in authStore.getPermissions(
                                    authStore.roles[0]?.id
                                )"
                                :key="perm.name"
                                class="badge badge-primary capitalize cursor-pointer"
                                :title="perm.description"
                            >
                                {{ perm.name }}
                            </span>
                        </div>
                        <div v-else class="text-gray-500">
                            No permissions assigned.
                        </div>
                    </div>
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

                <div v-if="authStore.hasRole('helper')" class="card">
                    <h2 class="text-xl font-semibold mb-6 text-gray-900">
                        Enhanced Helper Settings
                    </h2>

                    <div class="space-y-6">
                        <!-- Hourly Rate -->
                        <div>
                            <label
                                class="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Hourly Rate (₹)
                            </label>
                            <input
                                v-model.number="helperProfileForm.hourly_rate"
                                type="number"
                                min="100"
                                step="10"
                                class="input"
                                placeholder="Enter hourly rate"
                            />
                        </div>

                        <!-- Availability -->
                        <div>
                            <label
                                class="block text-sm font-medium text-gray-700 mb-4"
                            >
                                Availability
                            </label>
                            <div class="grid grid-cols-2 gap-3">
                                <label
                                    v-for="day in availableDays"
                                    :key="day"
                                    class="flex items-center space-x-2"
                                >
                                    <input
                                        type="checkbox"
                                        :checked="
                                            helperProfileForm.availability?.includes(
                                                day
                                            )
                                        "
                                        @change="toggleAvailability(day)"
                                        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                    />
                                    <span class="text-sm text-gray-700">{{
                                        day
                                    }}</span>
                                </label>
                            </div>
                        </div>

                        <!-- Skills -->
                        <div>
                            <label
                                class="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Skills
                            </label>
                            <textarea
                                v-model="helperProfileForm.skills_text"
                                rows="3"
                                class="input"
                                placeholder="Enter skills separated by commas (e.g., Cooking, Cleaning, Laundry)"
                            ></textarea>
                            <p class="text-xs text-gray-500 mt-1">
                                Separate multiple skills with commas
                            </p>
                        </div>

                        <!-- Availability Status -->
                        <div
                            class="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg"
                        >
                            <div class="flex-1">
                                <label
                                    class="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Currently Available for Bookings
                                </label>
                                <p class="text-xs text-gray-600">
                                    Toggle to show/hide your profile from
                                    searches
                                </p>
                            </div>
                            <div
                                class="relative inline-block w-12 h-6 bg-gray-300 rounded-full cursor-pointer transition"
                                :class="
                                    helperProfileForm.is_available
                                        ? 'bg-green-500'
                                        : 'bg-gray-300'
                                "
                                @click="
                                    helperProfileForm.is_available =
                                        !helperProfileForm.is_available
                                "
                            >
                                <div
                                    class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition transform"
                                    :class="{
                                        'translate-x-6':
                                            helperProfileForm.is_available,
                                    }"
                                ></div>
                            </div>
                        </div>

                        <!-- Status Message -->
                        <div
                            v-if="helperProfileForm.is_available"
                            class="p-3 bg-green-50 text-green-700 text-sm rounded-lg"
                        >
                            ✓ Your profile is visible to customers
                        </div>
                        <div
                            v-else
                            class="p-3 bg-yellow-50 text-yellow-700 text-sm rounded-lg"
                        >
                            ⚠ Your profile is hidden from customer searches
                        </div>

                        <!-- Error/Success Messages -->
                        <div
                            v-if="helperProfileError"
                            class="text-danger-600 text-sm p-3 bg-danger-50 rounded"
                        >
                            {{ helperProfileError }}
                        </div>
                        <div
                            v-if="helperProfileSuccess"
                            class="text-success-600 text-sm p-3 bg-success-50 rounded"
                        >
                            {{ helperProfileSuccess }}
                        </div>

                        <div class="flex justify-end">
                            <button
                                @click="updateHelperProfile"
                                :disabled="loading"
                                class="btn btn-primary"
                            >
                                {{
                                    loading
                                        ? "Saving..."
                                        : "Save Helper Settings"
                                }}
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
import { reactive, ref, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { api } from "../services/api";
import { avatarSrc } from "../utils/util";

const authStore = useAuthStore();
const loading = ref(false);
const error = ref("");
const avatarInput = ref(null);
const passwordError = ref("");
const passwordSuccess = ref("");
const helperProfileError = ref("");
const helperProfileSuccess = ref("");
const helperProfileId = ref(null);

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
        authStore.updateUserState({ avatar_url: resp.data });
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
    location: "",
    bio: "",
    categories: [],
    is_active: false,
    is_verified: false,
});

const helperProfileForm = reactive({
    hourly_rate: 0,
    skills_text: "",
    skills: [],
    availability: [],
    is_available: true,
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

const availableDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

const fetchProfile = async () => {
    loading.value = true;
    error.value = "";
    try {
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

        // Fetch helper profile if user is a helper
        if (authStore.hasRole("helper")) {
            await fetchHelperProfile();
        }
    } catch (e) {
        error.value = e.message || "Failed to load profile";
    } finally {
        loading.value = false;
    }
};

const fetchHelperProfile = async () => {
    try {
        const userId = authStore.user?.id;
        if (!userId) return;

        const resp = await api.getHelperProfileByUserId(userId);
        if (resp.success && resp.data) {
            const profile = resp.data;
            helperProfileId.value = profile.id;
            helperProfileForm.hourly_rate = profile.hourly_rate || 0;
            helperProfileForm.skills = profile.skills || [];
            helperProfileForm.skills_text = Array.isArray(profile.skills)
                ? profile.skills.join(", ")
                : profile.skills || "";
            helperProfileForm.availability = profile.availability || [];
            helperProfileForm.is_available = profile.is_available !== false;
        }
    } catch (e) {
        console.error("Failed to fetch helper profile:", e);
    }
};

const updateProfileForm = (user) => {
    profileForm.full_name = user.full_name || "";
    profileForm.email = user.email || "";
    profileForm.phone = user.phone || "";
    profileForm.location = user.location || "";
    profileForm.bio = user.bio || "";
    // profileForm.hourly_rate = user.hourly_rate || 250;
    profileForm.categories = user.categories || [];
    profileForm.is_active = user.is_active || false;
    profileForm.is_verified = user.is_verified || false;
};
onMounted(fetchProfile);

const updateProfile = async () => {
    loading.value = true;
    error.value = "";
    const resp = await api.updateProfile({
        full_name: profileForm.full_name,
        email: profileForm.email,
        phone: profileForm.phone,
        location: profileForm.location,
        bio: profileForm.bio,
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

const updateHelperProfile = async () => {
    if (!helperProfileId.value) {
        helperProfileError.value = "Helper profile not found";
        return;
    }

    loading.value = true;
    helperProfileError.value = "";
    helperProfileSuccess.value = "";

    // Convert skills_text to array
    const skillsArray = helperProfileForm.skills_text
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

    const resp = await api.updateHelperProfile(helperProfileId.value, {
        hourly_rate: helperProfileForm.hourly_rate || 250,
        skills: skillsArray,
        availability: helperProfileForm.availability,
        is_available: helperProfileForm.is_available,
    });

    if (resp.success) {
        helperProfileForm.skills = skillsArray;
        helperProfileSuccess.value =
            resp.message || "Helper settings updated successfully!";
        setTimeout(() => {
            helperProfileSuccess.value = "";
        }, 3000);
    } else {
        helperProfileError.value =
            resp.error || "Failed to update helper settings";
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
        passwordForm.new
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
        !!authStore.user?.phone_verified
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
            "Are you sure you want to delete your account? This cannot be undone."
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

const toggleAvailability = (day) => {
    const index = helperProfileForm.availability.indexOf(day);
    if (index > -1) {
        helperProfileForm.availability.splice(index, 1);
    } else {
        helperProfileForm.availability.push(day);
    }
};

const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};
</script>

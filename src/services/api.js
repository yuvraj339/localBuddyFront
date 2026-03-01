import {
    mockHelpers,
    mockBookings,
    mockCategories,
    mockChats,
    mockUser,
    mockHelperProfile,
    mockStats,
} from "./mockData";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:8000";

function parseJwt(token) {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const json = decodeURIComponent(
            atob(payload)
                .split("")
                .map(function (c) {
                    return (
                        "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                    );
                })
                .join(""),
        );
        return JSON.parse(json);
    } catch (e) {
        return null;
    }
}

export const api = {
    async getHelpers(filters = {}) {
        try {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== null && value !== "") params.append(key, value);
            });
            const res = await fetch(
                `${BASE_URL}/api/v1/helpers?${params.toString()}`,
            );
            if (!res.ok) throw new Error("Backend error");
            const data = await res.json();
            return { success: true, data, total: data.length };
        } catch (e) {
            // fallback to mock
            await delay(500);
            let helpers = [...mockHelpers];
            // ...existing filter logic from above...
            if (filters.category) {
                helpers = helpers.filter((h) =>
                    h.categories.some((c) =>
                        c
                            .toLowerCase()
                            .includes(filters.category.toLowerCase()),
                    ),
                );
            }
            if (filters.minRate) {
                helpers = helpers.filter(
                    (h) => h.hourlyRate >= filters.minRate,
                );
            }
            if (filters.maxRate) {
                helpers = helpers.filter(
                    (h) => h.hourlyRate <= filters.maxRate,
                );
            }
            if (filters.minRating) {
                helpers = helpers.filter((h) => h.rating >= filters.minRating);
            }
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                helpers = helpers.filter(
                    (h) =>
                        h.name.toLowerCase().includes(searchLower) ||
                        h.bio.toLowerCase().includes(searchLower) ||
                        h.skills.some((s) =>
                            s.toLowerCase().includes(searchLower),
                        ),
                );
            }
            return {
                success: true,
                data: helpers,
                total: helpers.length,
            };
        }
    },
    async getUserRoles(userId) {
        try {
            const res = await fetch(`${BASE_URL}/api/v1/users/${userId}/roles`);
            if (!res.ok) throw new Error("Failed to fetch roles");
            const data = await res.json();
            return { success: true, data };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },
    async getUserPermissions(userId) {
        try {
            const res = await fetch(
                `${BASE_URL}/api/v1/users/${userId}/permissions`,
            );
            if (!res.ok) throw new Error("Failed to fetch permissions");
            const data = await res.json();
            return { success: true, data };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },
    async getHelper(id) {
        try {
            const res = await fetch(`${BASE_URL}/api/v1/helpers/${id}`);
            if (!res.ok) throw new Error("Backend error");
            const data = await res.json();
            return { success: true, data };
        } catch (e) {
            await delay(300);
            const helper = mockHelpers.find((h) => h.id === parseInt(id));
            if (!helper) {
                return { success: false, error: "Helper not found" };
            }
            return { success: true, data: helper };
        }
    },
    async getHelperProfile(userId) {
        try {
            const res = await fetch(
                `${BASE_URL}/api/v1/helpers/user/${userId}`,
            );
            if (!res.ok) throw new Error("Backend error");
            const data = await res.json();
            return { success: true, data };
        } catch (e) {
            // fallback to mock
            await delay(200);
            return { success: true, data: mockHelperProfile };
        }
    },

    async getCategories() {
        await delay(200);
        return {
            success: true,
            data: mockCategories,
        };
    },

    async createBooking(bookingData) {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${BASE_URL}/api/v1/bookings/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(bookingData),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.detail || "Failed to create booking");
            }
            return {
                success: true,
                data: data,
                message: "Booking request sent successfully!",
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    },

    async getBookings(userId, role = "customer") {
        try {
            const token = localStorage.getItem("token");
            // If role is customer, fetch by customer_id; if helper, fetch by helper_id
            const param = role === "helper" ? "helper_id" : "customer_id";
            const res = await fetch(`${BASE_URL}/api/v1/bookings/${userId}`, {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.detail || "Failed to fetch bookings");
            }
            return {
                success: true,
                data,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    },

    async getBooking(id) {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${BASE_URL}/api/v1/bookings/${id}`, {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.detail || "Booking not found");
            }
            return {
                success: true,
                data,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    },

    async updateBookingStatus(id, status) {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(
                `${BASE_URL}/api/v1/bookings/${id}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify({ status }),
                },
            );
            const data = await res.json();
            if (!res.ok) {
                throw new Error(
                    data.detail || "Failed to update booking status",
                );
            }
            return {
                success: true,
                data,
                message: `Booking ${status} successfully`,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    },

    async getChats() {
        await delay(300);
        return {
            success: true,
            data: mockChats,
        };
    },

    async getChat(id) {
        await delay(200);
        const chat = mockChats.find((c) => c.id === parseInt(id));

        if (!chat) {
            return {
                success: false,
                error: "Chat not found",
            };
        }

        return {
            success: true,
            data: chat,
        };
    },

    async sendMessage(chatId, message) {
        await delay(400);
        const newMessage = {
            id: Date.now(),
            senderId: "customer",
            text: message,
            timestamp: new Date().toISOString(),
        };

        return {
            success: true,
            data: newMessage,
        };
    },

    async login(email, password) {
        // Use OAuth2 form fields: username, password
        try {
            const params = new URLSearchParams();
            params.append("username", email);
            params.append("password", password);

            const res = await fetch(`${BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: params.toString(),
            });

            if (!res.ok) {
                const err = await res
                    .json()
                    .catch(() => ({ detail: res.statusText }));
                return { success: false, error: err.detail || "Login failed" };
            }

            const json = await res.json();
            const token = json.access_token;
            const payload = parseJwt(token);
            const userId = payload?.sub || null;

            return {
                success: true,
                token,
                data: userId ? { id: userId } : null,
            };
        } catch (error) {
            return { success: false, error: error.message || "Network error" };
        }
    },

    async register(userData) {
        try {
            const res = await fetch(`${BASE_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            if (!res.ok) {
                const err = await res
                    .json()
                    .catch(() => ({ detail: res.statusText }));
                return {
                    success: false,
                    error: err.detail || "Registration failed",
                };
            }

            const user = await res.json();

            // Try to login after registration to get token
            const loginResp = await this.login(
                userData.email,
                userData.password,
            );
            if (!loginResp.success) {
                // Registration succeeded but login failed; return user without token
                return {
                    success: true,
                    data: user,
                    token: null,
                    message: "Registered but login failed",
                };
            }

            return { success: true, data: user, token: loginResp.token };
        } catch (error) {
            return { success: false, error: error.message || "Network error" };
        }
    },

    async getUserProfile() {
        const token = localStorage.getItem("token");
        if (!token) {
            return { success: false, error: "No token" };
        }
        const payload = parseJwt(token);
        if (!payload || !payload.sub) {
            return { success: false, error: "Invalid token payload" };
        }
        try {
            const res = await fetch(`${BASE_URL}/users/${payload.sub}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
                const err = await res
                    .json()
                    .catch(() => ({ detail: res.statusText }));
                return {
                    success: false,
                    error: err.detail || "Failed to fetch user",
                };
            }
            const user = await res.json();
            return { success: true, data: user };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },

    async getHelperProfile() {
        await delay(300);
        return {
            success: true,
            data: mockHelperProfile,
        };
    },

    async updateProfile(profileData) {
        const token = localStorage.getItem("token");
        if (!token) {
            return { success: false, error: "No token" };
        }
        const payload = parseJwt(token);
        if (!payload || !payload.sub) {
            return { success: false, error: "Invalid token payload" };
        }
        try {
            const res = await fetch(`${BASE_URL}/users/${payload.sub}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(profileData),
            });
            if (!res.ok) {
                const err = await res
                    .json()
                    .catch(() => ({ detail: res.statusText }));
                return {
                    success: false,
                    error: err.detail || "Failed to update profile",
                };
            }
            const user = await res.json();
            return {
                success: true,
                data: user,
                message: "Profile updated successfully",
            };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },

    async fetchReviews({ helperId, userId, bookingId } = {}) {
        try {
            const params = new URLSearchParams();
            if (helperId) params.append("helper_id", helperId);
            if (userId) params.append("user_id", userId);
            if (bookingId) params.append("booking_id", bookingId);
            const res = await fetch(
                `${BASE_URL}/api/v1/reviews?${params.toString()}`,
            );
            if (!res.ok) throw new Error("Failed to fetch reviews");
            const data = await res.json();
            return { success: true, data };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },

    async submitReview(reviewData) {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${BASE_URL}/api/v1/reviews/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(reviewData),
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.detail || "Failed to submit review");
            return {
                success: true,
                data,
                message: "Review submitted successfully",
            };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },

    async updateAvailability(availability) {
        await delay(400);
        return {
            success: true,
            data: availability,
            message: "Availability updated successfully",
        };
    },

    async getStats() {
        await delay(500);
        return {
            success: true,
            data: mockStats,
        };
    },

    async verifyDocument(documentData) {
        await delay(1000);
        return {
            success: true,
            message: "Document submitted for verification",
            estimatedTime: "24-48 hours",
        };
    },

    async bidOnJob(jobId, bidAmount, message) {
        await delay(600);
        return {
            success: true,
            data: {
                jobId,
                bidAmount,
                message,
                status: "pending",
            },
            message: "Bid submitted successfully",
        };
    },

    async trackLocation(bookingId, location) {
        await delay(200);
        return {
            success: true,
            data: { bookingId, location, timestamp: new Date().toISOString() },
        };
    },

    async sendSOS(bookingId, location) {
        await delay(300);
        return {
            success: true,
            message: "Emergency alert sent to authorities and platform support",
        };
    },

    async uploadAvatar(file) {
        const token = localStorage.getItem("token");
        if (!token) return { success: false, error: "No token" };
        const payload = parseJwt(token);
        if (!payload || !payload.sub)
            return { success: false, error: "Invalid token payload" };
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch(`${BASE_URL}/users/${payload.sub}/avatar`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            if (!res.ok) {
                const err = await res
                    .json()
                    .catch(() => ({ detail: res.statusText }));
                return {
                    success: false,
                    error: err.detail || "Failed to upload avatar",
                };
            }
            const user = await res.json();
            return { success: true, data: user };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },

    async updatePassword(currentPassword, newPassword) {
        const token = localStorage.getItem("token");
        if (!token) return { success: false, error: "No token" };
        const payload = parseJwt(token);
        if (!payload || !payload.sub)
            return { success: false, error: "Invalid token payload" };
        const formData = new FormData();
        formData.append("current_password", currentPassword);
        formData.append("new_password", newPassword);
        try {
            const res = await fetch(
                `${BASE_URL}/users/${payload.sub}/password`,
                {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                },
            );
            if (!res.ok) {
                const err = await res
                    .json()
                    .catch(() => ({ detail: res.statusText }));
                return {
                    success: false,
                    error: err.detail || "Failed to update password",
                };
            }
            const user = await res.json();
            return { success: true, data: user };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },

    async updateVerification(emailVerified, phoneVerified) {
        const token = localStorage.getItem("token");
        if (!token) return { success: false, error: "No token" };
        const payload = parseJwt(token);
        if (!payload || !payload.sub)
            return { success: false, error: "Invalid token payload" };
        const formData = new FormData();
        formData.append("email_verified", emailVerified);
        formData.append("phone_verified", phoneVerified);
        try {
            const res = await fetch(`${BASE_URL}/users/${payload.sub}/verify`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            if (!res.ok) {
                const err = await res
                    .json()
                    .catch(() => ({ detail: res.statusText }));
                return {
                    success: false,
                    error: err.detail || "Failed to update verification",
                };
            }
            const user = await res.json();
            return { success: true, data: user };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },

    async softDeleteAccount() {
        const token = localStorage.getItem("token");
        if (!token) return { success: false, error: "No token" };
        const payload = parseJwt(token);
        if (!payload || !payload.sub)
            return { success: false, error: "Invalid token payload" };
        try {
            const res = await fetch(`${BASE_URL}/users/${payload.sub}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
                const err = await res
                    .json()
                    .catch(() => ({ detail: res.statusText }));
                return {
                    success: false,
                    error: err.detail || "Failed to delete account",
                };
            }
            const user = await res.json();
            return { success: true, data: user };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },

    // ============= ROLES & PERMISSIONS MANAGEMENT =============
    async getRoles() {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${BASE_URL}/api/v1/roles`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (!res.ok) throw new Error("Failed to fetch roles");
            const data = await res.json();
            return { success: true, data };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },

    async createRole(roleData) {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${BASE_URL}/api/v1/role`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(roleData),
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.detail || "Failed to create role");
            return { success: true, data };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },

    async updateRole(roleId, roleData) {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${BASE_URL}/api/v1/role/${roleId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(roleData),
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.detail || "Failed to update role");
            return { success: true, data };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },

    async deleteRole(roleId) {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${BASE_URL}/api/v1/role/${roleId}`, {
                method: "DELETE",
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (!res.ok) throw new Error("Failed to delete role");
            return { success: true };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },

    async getPermissions() {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${BASE_URL}/api/v1/permissions`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (!res.ok) throw new Error("Failed to fetch permissions");
            const data = await res.json();
            return { success: true, data, rolePermissions: [] };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },

    async createPermission(permissionData) {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${BASE_URL}/api/v1/permission`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(permissionData),
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.detail || "Failed to create permission");
            return { success: true, data };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },

    async updatePermission(permId, permissionData) {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${BASE_URL}/api/v1/permission/${permId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(permissionData),
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.detail || "Failed to update permission");
            return { success: true, data };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },

    async deletePermission(permId) {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${BASE_URL}/api/v1/permission/${permId}`, {
                method: "DELETE",
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (!res.ok) throw new Error("Failed to delete permission");
            return { success: true };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },

    async assignPermissionToRole(roleId, permissionId) {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${BASE_URL}/api/v1/assign_permission`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    role_id: roleId,
                    permission_id: permissionId,
                }),
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.detail || "Failed to assign permission");
            return { success: true, data };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },

    async removePermissionFromRole(roleId, permissionId) {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(
                `${BASE_URL}/api/v1/revoke_permission/${roleId}/${permissionId}`,
                {
                    method: "DELETE",
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                },
            );
            if (!res.ok) throw new Error("Failed to remove permission");
            return { success: true };
        } catch (e) {
            return { success: false, error: e.message };
        }
    },
};

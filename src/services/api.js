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

export const api = {
    async getHelpers(filters = {}) {
        await delay(500);
        let helpers = [...mockHelpers];

        if (filters.category) {
            helpers = helpers.filter((h) =>
                h.categories.some((c) =>
                    c.toLowerCase().includes(filters.category.toLowerCase())
                )
            );
        }

        if (filters.minRate) {
            helpers = helpers.filter((h) => h.hourlyRate >= filters.minRate);
        }

        if (filters.maxRate) {
            helpers = helpers.filter((h) => h.hourlyRate <= filters.maxRate);
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
                    h.skills.some((s) => s.toLowerCase().includes(searchLower))
            );
        }

        return {
            success: true,
            data: helpers,
            total: helpers.length,
        };
    },

    async getHelper(id) {
        await delay(300);
        const helper = mockHelpers.find((h) => h.id === parseInt(id));

        if (!helper) {
            return {
                success: false,
                error: "Helper not found",
            };
        }

        return {
            success: true,
            data: helper,
        };
    },

    async getCategories() {
        await delay(200);
        return {
            success: true,
            data: mockCategories,
        };
    },

    async createBooking(bookingData) {
        await delay(800);
        const newBooking = {
            id: mockBookings.length + 1,
            ...bookingData,
            status: "pending",
            createdAt: new Date().toISOString(),
        };

        return {
            success: true,
            data: newBooking,
            message: "Booking request sent successfully!",
        };
    },

    async getBookings(userId, role = "customer") {
        await delay(400);
        return {
            success: true,
            data: mockBookings,
        };
    },

    async getBooking(id) {
        await delay(300);
        const booking = mockBookings.find((b) => b.id === parseInt(id));

        if (!booking) {
            return {
                success: false,
                error: "Booking not found",
            };
        }

        return {
            success: true,
            data: booking,
        };
    },

    async updateBookingStatus(id, status) {
        await delay(500);
        return {
            success: true,
            data: { id, status },
            message: `Booking ${status} successfully`,
        };
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
        await delay(600);

        if (email === "helper@test.com") {
            return {
                success: true,
                data: mockHelperProfile,
                token: "mock-jwt-token-helper",
            };
        }

        return {
            success: true,
            data: mockUser,
            token: "mock-jwt-token-customer",
        };
    },

    async register(userData) {
        await delay(700);
        const newUser = {
            id: `${userData.role}-${Date.now()}`,
            ...userData,
            verified: false,
            memberSince: new Date().toISOString(),
        };

        return {
            success: true,
            data: newUser,
            token: "mock-jwt-token",
            message: "Registration successful!",
        };
    },

    async getUserProfile() {
        await delay(300);
        return {
            success: true,
            data: mockUser,
        };
    },

    async getHelperProfile() {
        await delay(300);
        return {
            success: true,
            data: mockHelperProfile,
        };
    },

    async updateProfile(profileData) {
        await delay(500);
        return {
            success: true,
            data: { ...mockUser, ...profileData },
            message: "Profile updated successfully",
        };
    },

    async submitReview(bookingId, reviewData) {
        await delay(400);
        return {
            success: true,
            data: { bookingId, ...reviewData },
            message: "Review submitted successfully",
        };
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
};

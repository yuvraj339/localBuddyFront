import { defineStore } from "pinia";
import { api } from "../services/api";

export const useBookingStore = defineStore("booking", {
    state: () => ({
        bookings: [],
        currentBooking: null,
        loading: false,
        error: null,
    }),

    getters: {
        upcomingBookings: (state) =>
            state.bookings.filter((b) => b.status === "upcoming"),
        completedBookings: (state) =>
            state.bookings.filter((b) => b.status === "completed"),
        pendingBookings: (state) =>
            state.bookings.filter((b) => b.status === "pending"),
    },

    actions: {
        async fetchBookings(userId, role) {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.getBookings(userId, role);

                if (response.success) {
                    this.bookings = response.data;
                } else {
                    this.error = response.error;
                }
            } catch (error) {
                this.error = error.message;
            } finally {
                this.loading = false;
            }
        },

        async createBooking(bookingData) {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.createBooking(bookingData);

                if (response.success) {
                    this.bookings.push(response.data);
                    return response.data;
                } else {
                    this.error = response.error;
                    return null;
                }
            } catch (error) {
                this.error = error.message;
                return null;
            } finally {
                this.loading = false;
            }
        },

        async updateBookingStatus(id, status) {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.updateBookingStatus(id, status);

                if (response.success) {
                    const index = this.bookings.findIndex((b) => b.id === id);
                    if (index !== -1) {
                        this.bookings[index].status = status;
                    }
                    return true;
                } else {
                    this.error = response.error;
                    return false;
                }
            } catch (error) {
                this.error = error.message;
                return false;
            } finally {
                this.loading = false;
            }
        },

        setCurrentBooking(booking) {
            this.currentBooking = booking;
        },
    },
});

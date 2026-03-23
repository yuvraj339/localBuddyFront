import { defineStore } from "pinia";
import { api } from "../services/api";
import { format, isToday, isPast, isFuture } from "date-fns";

export const useBookingStore = defineStore("booking", {
    state: () => ({
        bookings: [],
        currentBooking: null,
        loading: false,
        error: null,
    }),

    getters: {
        getBookings: (state) => (status) =>
            state.bookings.filter((b) => b.status === status),
    },

    actions: {
        async fetchBookings(userId, role) {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.getBookings(userId, role);

                if (response.success) {
                    this.bookings = response.data.map((booking) => {
                        const bookingDate = new Date(booking.date);
                        if (isToday(bookingDate)) {
                            booking.status = "pending";
                        } else if (isPast(bookingDate)) {
                            booking.status = "completed";
                        } else if (isFuture(bookingDate)) {
                            booking.status = "upcoming";
                        }
                        return booking;
                    });
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

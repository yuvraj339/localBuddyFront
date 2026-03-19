import { defineStore } from "pinia";
import { api } from "../services/api";
import { ref } from "vue";

export const usePaymentStore = defineStore("payment", {
    state: () => ({
        paymentRes: ref(null),
    }),

    getters: {
        //
    },

    actions: {
        async createPayment(paymentData) {
            const response = await api.makePayment(paymentData);
            if (response.success) {
                this.paymentRes = response.data;
            }
        },
    },
});

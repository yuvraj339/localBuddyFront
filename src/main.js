import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import "./style.css";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

import App from "./App.vue";
import { i18n } from "./i18n";

const app = createApp(App);
app.component("VueDatePicker", VueDatePicker);
document.documentElement.lang = i18n.locale.value;

const pinia = createPinia();

app.use(pinia);
app.use(router);
app.provide("i18n", i18n);
app.config.globalProperties.$t = i18n.t;
app.mount("#app");

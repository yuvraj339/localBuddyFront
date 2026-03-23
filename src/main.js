import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import "./style.css";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

import App from "./App.vue";

const app = createApp(App);
app.component("VueDatePicker", VueDatePicker);

const pinia = createPinia();

app.use(pinia);
app.use(router);
app.mount("#app");

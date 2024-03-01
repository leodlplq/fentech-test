import { autoAnimatePlugin } from "@formkit/auto-animate/vue";
import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

createApp(App).use(autoAnimatePlugin).mount("#app");

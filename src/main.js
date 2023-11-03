import { createApp } from "vue";
import "./styles/index.scss";
import App from "./App.vue";
import router from "./router/index.js";
import store from "./store/index.js";
import "./permission.js";
const app = createApp(App);
app.use(store);
app.use(router);

app.mount("#app");

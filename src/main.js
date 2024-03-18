import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import store from "./store/index.js";
import "./permission.js";
import Avue from "@smallwei/avue";
import axios from "@/router/axios.js";
import "./styles/index.scss";
import "./styles/element-variables.scss";
import "./styles/dark.scss";
import ElementPlus from "element-plus";
import AdminComponent from "package/index.js";

const app = createApp(App);
app.use(store);
app.use(router);
app.use(ElementPlus);
app.use(AdminComponent);
app.use(Avue, { axios, size: "medium" });

app.mount("#app");

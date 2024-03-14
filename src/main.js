import { createApp } from "vue";
import ElementPlus from "element-plus";
import App from "./App.vue";
import router from "./router/index.js";
import store from "./store/index.js";
import "./permission.js";
import "element-plus/dist/index.css";
import Avue from "@smallwei/avue";
import "@smallwei/avue/lib/index.css";
import axios from "@/router/axios.js";
import "./styles/avue.scss";
import "./styles/index.scss";
import AdminComponent from "package/index.js";

const app = createApp(App);
app.use(store);
app.use(router);
app.use(ElementPlus);
app.use(AdminComponent);
app.use(Avue, { axios, size: "small" });

app.mount("#app");

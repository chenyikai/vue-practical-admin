import { createApp } from "vue";
import App from "./App.vue";
import "virtual:svg-icons-register";
import router from "./router/index.js";
import store from "./store/index.js";
import "./permission.js";
import Avue from "@smallwei/avue";
import axios from "@/router/axios.js";
import "./styles/index.scss";
import "./styles/element-variables.scss";
import "./styles/theme.scss";
import "plugins/index.scss";
import ElementPlus from "element-plus";
import { draggable } from "@/utils/directive.js";
import AdminComponent from "package/index.js";

const app = createApp(App);
app.use(store);
app.use(router);
app.use(ElementPlus);
app.use(AdminComponent);
app.directive("draggable", draggable);
app.use(Avue, { axios });

app.mount("#app");

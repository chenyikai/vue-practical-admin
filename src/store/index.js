import { createPinia } from "pinia";
import tabStore from "./module/tabStore.js";
import menuStore from "./module/menuStore.js";
import userStore from "./module/userStore.js";

const pinia = createPinia();

export default pinia;
export { tabStore, menuStore, userStore };

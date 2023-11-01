import { createPinia } from "pinia";
import piniaPersist from "pinia-plugin-persist";
import tabStore from "./module/tabStore.js";
import menuStore from "./module/menuStore.js";

const pinia = createPinia();
pinia.use(piniaPersist);

export default pinia;
export { tabStore, menuStore };

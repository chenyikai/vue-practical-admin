import { createPinia } from "pinia";
import tabStore from "./module/tabStore";
import menuStore from "./module/menuStore";
import userStore from "./module/userStore";
import searchStore from "./module/searchStore";
import shipInfoStore from "./module/shipInfoStore";
import popupManageStore from "./module/popupManage";

const pinia = createPinia();

export default pinia;
export { popupManageStore, tabStore, menuStore, userStore, searchStore, shipInfoStore };

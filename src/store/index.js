import { createPinia } from "pinia";
import tabStore from "./module/tabStore.js";
import menuStore from "./module/menuStore.js";
import userStore from "./module/userStore.js";
import searchStore from "./module/searchStore.js";
import shipInfoStore from "./module/shipInfoStore.js";
import popupManageStore from "./module/popupManage.js";
import mapStore from "./module/mapStore.js";

const pinia = createPinia();

export default pinia;
export {
  popupManageStore,
  tabStore,
  menuStore,
  userStore,
  searchStore,
  shipInfoStore,
  mapStore,
};

import { defineStore } from "pinia";
import { getStore, setStore } from "@/utils/store.js";

const menuStore = defineStore("menu", {
  state: () => {
    return {
      menuList: getStore({ name: "menu" }) || [],
      secondaryMenu: {},
    };
  },
  actions: {
    setMenu(val) {
      setStore({ name: "menu", content: val });
      this.menuList = val;
    },
    getSecondMenu(id) {
      const menu = this.menuList.find(
        (item) => String(item["id"]) === String(id),
      );
      return menu ? menu["children"] : [];
    },
  },
  persist: {
    enabled: true,
    // strategies: [
    //   {
    //     storage: "localStorage",
    //     key: website.storageKey,
    //   },
    // ],
  },
});

export default menuStore;

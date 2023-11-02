import { defineStore } from "pinia";

const menuStore = defineStore("menu", {
  state: () => {
    return {
      menuList: [],
      secondaryMenu: {},
    };
  },
  actions: {
    setMenu(val) {
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

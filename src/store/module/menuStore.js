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
      console.log(this.menuList, "menuList");
    },
    getSecondMenu(id) {
      const menu = this.menuList.find((item) => item.id === id);
      if (menu) {
        return menu["children"] || [];
      }
    },
  },
});

export default menuStore;

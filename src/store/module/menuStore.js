import { defineStore } from "pinia";
import { getStore, setStore } from "@/utils/store.js";
import website from "@/config/website.js";
const { children } = website.menu.props;

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
    getMenu(id) {
      const loop = (menuData) => {
        for (const menuDatum of menuData) {
          if (String(menuDatum["id"]) === String(id)) {
            return menuDatum;
          }

          if (
            Array.isArray(menuDatum[children]) &&
            menuDatum[children].length !== 0
          ) {
            const menu = loop(menuDatum[children]);
            if (menu) return menu;
          }
        }
      };

      return loop(this.menuList);
    },
    getNextLevelMenu(id) {
      const menu = this.getMenu(id);
      return menu ? menu[children] : [];
    },
    deleteAll() {
      this.menuList = [];
      setStore({ name: "menu", content: [] });
    },
  },
});

export default menuStore;

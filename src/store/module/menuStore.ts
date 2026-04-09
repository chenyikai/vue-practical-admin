import { defineStore } from "pinia";
import { getStore, setStore } from "@/utils/store";
import website from "@/config/website";
import { validatenull } from "@/utils/validate";

const { children: childrenKey } = website.menu.props;

interface MenuItem {
  id: string | number;
  [key: string]: unknown;
}

interface FindMenuParams {
  key?: string;
  value?: string | number;
  expression?: (item: MenuItem) => boolean;
}

const menuStore = defineStore("menu", {
  state: () => ({
    menuList: (getStore({ name: "menu" }) as MenuItem[] | undefined) ?? [],
    secondaryMenu: {} as MenuItem,
  }),
  actions: {
    setMenu(val: MenuItem[]): void {
      setStore({ name: "menu", content: val });
      this.menuList = val;
    },
    getMenu(id: string | number): MenuItem | undefined {
      const loop = (menuData: MenuItem[]): MenuItem | undefined => {
        for (const item of menuData) {
          if (String(item.id) === String(id)) {
            return item;
          }
          const children = item[childrenKey];
          if (Array.isArray(children) && children.length > 0) {
            const found = loop(children as MenuItem[]);
            if (found) {
              return found;
            }
          }
        }
        return undefined;
      };
      return loop(this.menuList);
    },
    findMenu({ key, value, expression }: FindMenuParams): MenuItem | undefined {
      const loop = (menuData: MenuItem[]): MenuItem | undefined => {
        for (const item of menuData) {
          if (!validatenull(expression)) {
            if (expression?.(item)) {
              return item;
            }
          } else {
            if (key !== undefined && String(item[key]) === String(value)) {
              return item;
            }
          }
          const children = item[childrenKey];
          if (Array.isArray(children) && children.length > 0) {
            const found = loop(children as MenuItem[]);
            if (found) {
              return found;
            }
          }
        }
        return undefined;
      };
      return loop(this.menuList);
    },
    getNextLevelMenu(id: string | number): MenuItem[] {
      const menu = this.getMenu(id);
      const children = menu?.[childrenKey];
      return Array.isArray(children) ? (children as MenuItem[]) : [];
    },
    deleteAll(): void {
      this.menuList = [];
      setStore({ name: "menu", content: [] });
    },
  },
});

export default menuStore;

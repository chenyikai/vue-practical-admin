import { defineStore } from "pinia";
import website from "@/config/website.js";
import { getStore, setStore } from "@/utils/store.js";
import { menuStore } from "@/store/index.js";

// const isFirstPage = website.isFirstPage;
const tagWel = website.fistPage;
const tagObj = {
  label: "", // 标题名称
  value: "", // 标题的路径
  params: "", // 标题的路径参数
  query: "", // 标题的参数
  meta: {}, // 额外参数
  icon: "", // 图标
};

const tabStore = defineStore("tab", {
  state: () => {
    return {
      tab: getStore({ name: "tab" }) || {},
      tabList: getStore({ name: "tabList" }) || [],
    };
  },
  actions: {
    find(tab) {
      return this.tabList.find((item) => item.value === tab.value);
    },
    add(data) {
      this.tab = data;
      setStore({ name: "tab", content: this.tab });
      const flag =
        this.tabList.findIndex((item) => item.value === data.value) === -1;
      if (!flag) return;

      if (data.label === "MenuPage") {
        const menu = menuStore().getMenu(data.query.id);
        const { label, icon } = website.menu.props;
        data.label = menu[label];
        data.icon = menu[icon];
      }
      this.tabList.push(data);
      setStore({ name: "tabList", content: this.tabList });
    },
    updateAll(list) {
      this.tabList = list;
      setStore({ name: "tabList", content: this.tabList });
    },
    delete(data) {
      const index = this.tabList.findIndex((item) => item.value === data.value);
      if (index === -1) return;
      const isLast = index === this.tabList.length - 1;

      this.tabList.splice(index, 1);
      setStore({ name: "tabList", content: this.tabList });

      if (data.value === this.tab.value) {
        this.tab = this.tabList[isLast ? index - 1 : index];
        setStore({ name: "tab", content: this.tab });
      }
    },
    deleteRight(data, callback) {
      const index = this.tabList.findIndex((item) => item.value === data.value);
      if (index === -1) return;

      this.tabList = this.tabList.slice(0, index + 1);
      setStore({ name: "tabList", content: this.tabList });

      const i = this.tabList.findIndex((item) => item.value === this.tab.value);
      if (i === -1) {
        this.tab = this.tabList.at(-1);
        setStore({ name: "tab", content: this.tab });
      }

      callback();
    },
    deleteAll() {
      this.tabList = [tagWel];
      setStore({ name: "tabList", content: this.tabList });
    },
    deleteOther(tab) {
      this.tabList = this.tabList.filter((item) => {
        if (item.value === tab.value) {
          return true;
        } else if (
          !website.isFirstPage &&
          item.value === website.fistPage.value
        ) {
          return true;
        }
      });
      setStore({ name: "tabList", content: this.tabList });
    },
    clean() {
      this.tab = tagObj;
      setStore({ name: "tab", content: this.tab });
    },
  },
});

export default tabStore;

import { defineStore } from "pinia";
import { diff } from "@/utils/util.js";
import website from "@/config/website.js";
import { getStore, setStore } from "@/utils/store.js";
import { menuStore } from "@/store/index.js";

const isFirstPage = website.isFirstPage;
const tagWel = website.fistPage;
const tagObj = {
  label: "", // 标题名称
  value: "", // 标题的路径
  params: "", // 标题的路径参数
  query: "", // 标题的参数
  meta: {}, // 额外参数
  icon: "", // 图标
};

// 处理首个标签
function setFistTag(list) {
  if (list.length === 1) {
    list[0].close = false;
  } else {
    list.forEach((ele) => {
      ele.close = !(ele.value === tagWel.value && isFirstPage === false);
    });
  }
}

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
      setFistTag(this.tabList);
      setStore({ name: "tabList", content: this.tabList });
    },
    edit() {},
    delete(data) {
      this.tabList = this.tabList.filter((item) => {
        return !diff(item, data);
      });
      setFistTag(this.tabList);
      setStore({ name: "tabList", content: this.tabList });
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
      setFistTag(this.tabList);
      setStore({ name: "tabList", content: this.tabList });
    },
    clean() {
      this.tab = tagObj;
      setStore({ name: "tab", content: this.tab });
    },
  },
});

export default tabStore;

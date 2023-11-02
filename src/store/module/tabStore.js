import { defineStore } from "pinia";
import { diff } from "@/utils/util.js";
import website from "@/config/website.js";

const isFirstPage = website.isFirstPage;
const tagWel = website.fistPage;

// 处理首个标签
function setFistTag(list) {
  if (list.length === 1) {
    list[0].close = false;
  } else {
    list.forEach((ele) => {
      if (ele.value === tagWel.value && isFirstPage === false) {
        ele.close = false;
      } else {
        ele.close = true;
      }
    });
  }
}

const tabStore = defineStore("tab", {
  state: () => {
    return {
      tab: {},
      tabList: [],
    };
  },
  actions: {
    add(data) {
      this.tab = data;
      if (this.tabList.some((ele) => diff(ele, data))) return;
      this.tabList.push(data);
      setFistTag(this.tabList);
    },
    delete(data) {
      console.log(data, "delete");
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

export default tabStore;

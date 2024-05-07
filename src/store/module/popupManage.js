import { defineStore } from "pinia";

const popupManageStore = defineStore("popupManage", {
  state: () => {
    return {
      zIndex: 2000,
    };
  },
  actions: {
    nextZIndex() {
      this.zIndex += 100;
    },
  },
});

export default popupManageStore;

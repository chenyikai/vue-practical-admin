import { defineStore } from "pinia";
import { getStore, setStore } from "@/utils/store.js";

const mapStore = defineStore("map", {
  state: () => {
    return {
      initMap: false, // 大屏地图初始化完成
      drawData: getStore({ name: "draw-data" }) || [],
    };
  },
  actions: {
    setDrawData(val) {
      setStore({ name: "draw-data", type: true, content: val });
      this.drawData = val;
    },
  },
});

export default mapStore;

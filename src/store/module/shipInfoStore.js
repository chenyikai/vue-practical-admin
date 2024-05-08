import { defineStore } from "pinia";
import { popupManageStore } from "@/store";
import { getShipPoiByMmsi } from "@/api/map/ship.js";

const shipInfoStore = defineStore("shipInfo", {
  state: () => {
    return {
      visible: true,
      loading: false,
      zIndex: 0,
      shipData: {},
    };
  },
  getters: {
    isEmpty(state) {
      return state.results.length === 0;
    },
  },
  actions: {
    show(mmsi) {
      this.visible = true;
      this.zIndex = popupManageStore().nextZIndex();

      this.getData(mmsi);
    },
    hide() {
      this.loading = false;
      this.results = [];
      this.visible = false;
      this.zIndex = 0;
    },
    getData(mmsi) {
      this.loading = true;
      getShipPoiByMmsi(mmsi)
        .then(({ data }) => {
          this.shipData = data.data;
          console.log(this.shipData, "shipData");
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
});

export default shipInfoStore;

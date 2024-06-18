import { defineStore } from "pinia";
import { popupManageStore } from "@/store";
import { getShipPoiByMmsi } from "@/api/map/ship.js";
import { MapboxShip } from "plugins/index.js";

const shipInfoStore = defineStore("shipInfo", {
  state: () => {
    return {
      visible: false,
      loading: false,
      zIndex: 0,
      shipData: {},
      isOwn: false,
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
          MapboxShip.setFocus(this.shipData);
          MapboxShip.isOwnShip(this.shipData).then((flag) => {
            this.isOwn = flag;
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
});

export default shipInfoStore;

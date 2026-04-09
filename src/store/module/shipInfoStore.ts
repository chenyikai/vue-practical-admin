import { defineStore } from "pinia";
import { popupManageStore } from "@/store";
import { getShipPoiByMmsi } from "@/api/map/ship";

const shipInfoStore = defineStore("shipInfo", {
  state: () => ({
    visible: false,
    loading: false,
    zIndex: 0,
    shipData: {} as Record<string, unknown>,
    isOwn: false,
  }),
  actions: {
    show(mmsi: string | number): void {
      this.visible = true;
      this.zIndex = popupManageStore().nextZIndex();
      this.getData(mmsi);
    },
    hide(): void {
      this.loading = false;
      this.visible = false;
      this.shipData = {};
      this.isOwn = false;
      this.zIndex = 0;
    },
    getData(mmsi: string | number): void {
      this.loading = true;
      getShipPoiByMmsi(mmsi)
        .then((res) => {
          const data = res.data as Record<string, unknown>;
          this.shipData = data["data"] as Record<string, unknown>;
        })
        .catch(console.error)
        .finally(() => {
          this.loading = false;
        });
    },
  },
});

export default shipInfoStore;

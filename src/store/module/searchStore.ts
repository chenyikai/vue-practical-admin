import { defineStore } from "pinia";
import { getShipByKeyword } from "@/api/map/search";
import { popupManageStore } from "@/store";

const searchStore = defineStore("search", {
  state: () => ({
    visible: false,
    loading: false,
    results: [] as Record<string, unknown>[],
    zIndex: 0,
  }),
  getters: {
    isEmpty(state): boolean {
      return state.results.length === 0;
    },
  },
  actions: {
    show(): void {
      this.visible = true;
      this.zIndex = popupManageStore().nextZIndex();
    },
    hide(): void {
      this.loading = false;
      this.results = [];
      this.visible = false;
      this.zIndex = 0;
    },
    search(keyword: string): void {
      this.loading = true;
      getShipByKeyword({ keyword, page: 1, pageSize: 20 })
        .then((res) => {
          const resData = res.data as Record<string, unknown>;
          const inner = resData["data"] as Record<string, unknown>;
          this.results = inner["data"] as Record<string, unknown>[];
        })
        .catch(console.error)
        .finally(() => {
          this.loading = false;
        });
    },
  },
});

export default searchStore;

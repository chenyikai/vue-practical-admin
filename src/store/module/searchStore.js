import { defineStore } from "pinia";
import { getShipByKeyword } from "@/api/map/search.js";

const searchStore = defineStore("search", {
  state: () => {
    return {
      visible: false,
      loading: false,
      results: [],
    };
  },
  getters: {
    isEmpty(state) {
      return state.results.length === 0;
    },
  },
  actions: {
    show() {
      this.visible = true;
    },
    hide() {
      this.loading = false;
      this.results = [];
      this.visible = false;
    },
    load(flag) {
      this.loading = flag;
    },
    search(keyword) {
      this.loading = true;
      getShipByKeyword({
        keyword,
        page: 1,
        pageSize: 20,
      })
        .then(({ data }) => {
          this.results = data.data.data;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
});

export default searchStore;

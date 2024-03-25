<template>
  <div class="ehh-route-draw_popup-content">
    <span>{{ data.distance | toFixed2 }}nm</span>
    <span>{{ data.bearing | formatDegree }}</span>
  </div>
</template>

<script>
import { formatDegree } from "./util";

export default {
  name: "EhhRouteDrawPopupContent",
  data() {
    return {
      data: {},
    };
  },
  filters: {
    formatDegree(val) {
      return formatDegree(val).value;
    },
    toFixed2(val) {
      let v = Number(val);
      if (isNaN(v)) return 0;
      return v.toFixed(2);
    },
  },
  methods: {
    updateData(data) {
      this.data = data;
    },
  },
};
</script>

<style lang="scss">
.ehh-route-draw_popup-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

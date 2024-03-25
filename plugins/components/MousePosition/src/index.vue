<script>
import MapboxMousePosition from "@/plugins/composition/mapbox-mouse-position";
import { formatLatitudeAndLongitude } from "@/util/util";

export default {
  name: "MousePosition",
  data() {
    return {
      lngLat: {
        lng: "",
        lat: "",
      },
    };
  },
  mounted() {
    MapboxMousePosition.on("move", this.handleMove);
  },
  beforeDestroy() {
    MapboxMousePosition.off("move", this.handleMove);
  },
  methods: {
    handleMove(e) {
      const { longitude, latitude } = formatLatitudeAndLongitude(e.lng, e.lat);
      this.$set(this.lngLat, "lat", latitude.completeValue);
      this.$set(this.lngLat, "lng", longitude.completeValue);
    },
  },
};
</script>

<template>
  <div class="mouse-position-container">
    <div class="row">{{ lngLat.lng }}</div>
    <div class="row">{{ lngLat.lat }}</div>
  </div>
</template>

<style scoped lang="scss">
.mouse-position-container {
  position: absolute;
  bottom: 20px;
  left: 10px;
  background-color: #fff;
  //line-height: 10px;
  width: max-content;
  border-radius: 4px;
  padding: 4px;
  color: rgba($color: #000, $alpha: 0.8);
  box-shadow: 0px 0px 4px 0px rgba(1, 24, 68, 0.19);
}
</style>

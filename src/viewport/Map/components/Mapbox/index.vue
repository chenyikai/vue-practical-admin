<script>
export default {
  name: "MapBox",
};
</script>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import init, { Mapbox, MapboxShip, MapboxDraw } from "plugins/index.js";
import { shipInfoStore } from "@/store";
// import { trackData, shipData } from "./data.js";
// import Plot from "plugins/composition/Plot";
const ShipInfoStore = shipInfoStore();

const map = ref({});
const loading = ref(false);

function onClick(e) {
  console.log(e);
  ShipInfoStore.show(e.id);
}

function initMap() {
  const options = {
    container: "map",
  };
  init(options, () => {
    MapboxShip.init();
    MapboxDraw.init();

    Mapbox.getMap().resize();

    // MapboxTrack.trackSetData(trackData, shipData, true);

    // const plot = new Plot({ map: Mapbox.getMap() });
    // plot.changeMode(Plot.DRAW_POINT, {});
    MapboxShip.on("click", onClick);
  });
}

onBeforeUnmount(() => {
  MapboxShip.off("click", onClick);

  MapboxShip.destroy();
  Mapbox.destroy();
});

onMounted(() => {
  initMap();
});
</script>

<template>
  <div v-loading="loading" ref="map" id="map" />
</template>

<style scoped lang="scss">
#map {
  width: 100%;
  height: 100%;
}
</style>

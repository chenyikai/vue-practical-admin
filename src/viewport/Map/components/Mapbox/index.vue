<script>
export default {
  name: "MapBox",
};
</script>

<script setup>
import { ref, onMounted } from "vue";
import init, { Mapbox, MapboxShip } from "plugins/index.js";
// import { trackData, shipData } from "./data.js";
// import Plot from "plugins/composition/Plot";

const map = ref({});
const loading = ref(false);

function initMap() {
  const options = {
    container: "map",
  };
  init(options, () => {
    MapboxShip.init();

    Mapbox.getMap().resize();

    // MapboxTrack.trackSetData(trackData, shipData, true);
    // const plot = new Plot({ map: Mapbox.getMap() });
    // plot.changeMode(Plot.DRAW_POINT, {});
  });
}

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

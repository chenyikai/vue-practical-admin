<script>
export default {
  name: "MapBox",
};
</script>

<script setup>
import { ref, onMounted } from "vue";
import init, { Mapbox } from "plugins/index.js";
import Plot from "plugins/composition/Plot";

const map = ref({});
const loading = ref(false);

function initMap() {
  const options = {
    container: "map",
  };
  init(options, () => {
    Mapbox.getMap().resize();

    const plot = new Plot({ map: Mapbox.getMap() });
    plot.start(Plot.DRAW_POINT, {});
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

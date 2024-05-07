<script>
export default {
  name: "MapBox",
};
</script>

<script setup>
import { cloneDeep } from "lodash";
import { baseMap } from "plugins/mapConfig.js";
import { ref, onMounted } from "vue";
import Mapbox from "plugins/composition/mapbox.js";
import MapboxSwitch from "plugins/composition/mapbox-switch.js";

const map = ref({});
const loading = ref(false);

function initMap() {
  const options = {
    container: "map",
  };
  Mapbox.init(options, (data) => {
    addSwitch(data);
  });
}

function addSwitch({ map, ehhGis }) {
  MapboxSwitch.setData({
    map,
    mapSwitch: new ehhGis.MapLayerSwitch(map, cloneDeep(baseMap)),
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

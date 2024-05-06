<script>
export default {
  name: "MapPage",
};
</script>

<script setup>
import { onMounted } from "vue";
import Mapbox from "plugins/composition/mapbox.js";
import MapboxSwitch from "plugins/composition/mapbox-switch.js";
import { baseMap } from "plugins/mapConfig.js";
import MapLayout from "@/components/MapLayout/index.vue";
import { cloneDeep } from "lodash";

defineOptions({
  name: "MapPage",
});

function addSwitch({ map, ehhGis }) {
  MapboxSwitch.setData({
    map,
    mapSwitch: new ehhGis.MapLayerSwitch(map, cloneDeep(baseMap)),
  });
}

onMounted(() => {
  Mapbox.init(
    {
      container: "map",
    },
    (data) => {
      addSwitch(data);
    },
  );
});
</script>

<template>
  <map-layout>
    <div id="map" />
  </map-layout>
</template>

<style lang="scss" scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>

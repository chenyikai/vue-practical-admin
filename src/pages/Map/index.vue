<script>
export default {
  name: "MapPage",
};
</script>

<script setup>
import MapLayout from "@/pages/Map/components/MapLayout/index.vue";
import MapBox from "@/pages/Map/components/Mapbox/index.vue";
import SearchBar from "./components/SearchBar/index.vue";
import ShipInfo from "@/pages/Map/components/ShipInfo/index.vue";
import MapControl from "@/pages/Map/components/MapControl/index.vue";

defineOptions({
  name: "MapPage",
});
</script>

<template>
  <map-layout>
    <template #map>
      <map-box />
    </template>
    <template #control>
      <search-bar />
      <ship-info />
      <map-control />
    </template>
  </map-layout>
</template>

<style lang="scss" scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>

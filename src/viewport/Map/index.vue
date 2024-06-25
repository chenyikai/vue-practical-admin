<script>
export default {
  name: "MapPage",
};
</script>

<script setup>
import MapLayout from "./components/MapLayout/index.vue";
import MapBox from "./components/Mapbox/index.vue";
import SearchBar from "./components/SearchBar/index.vue";
import ShipInfo from "./components/ShipInfo/index.vue";
import MapControl from "./components/MapControl/index.vue";
import SideBar from "./components/SideBar/index.vue";
import { shipInfoStore } from "@/store";
const ShipInfoStore = shipInfoStore();

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
      <ship-info v-if="ShipInfoStore.visible" />
      <map-control />
      <side-bar />
    </template>
  </map-layout>
</template>

<style lang="scss" scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>

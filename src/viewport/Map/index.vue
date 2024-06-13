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
import GalesPack from "./components/GalesPack/index.vue";
import HurricanePack from "./components/HurricanePack/index.vue";
import MapChannelMonitor from "@/viewport/Map/components/ChannelMonitor/index.vue";
import { ref } from "vue";

defineOptions({
  name: "MapPage",
});

const galesPack = ref();
const hurricanePack = ref();
const channelMonitor = ref();

function initMap() {
  hurricanePack.value.init();
  // galesPack.value.open(1);
  // hurricanePack.value.open(2);
  channelMonitor.value.init();
}
</script>

<template>
  <map-layout>
    <template #map>
      <map-box @init="initMap" />
    </template>
    <template #control>
      <search-bar />
      <ship-info />
      <map-control />
      <side-bar />

      <GalesPack ref="galesPack" />
      <HurricanePack ref="hurricanePack" />
      <map-channel-monitor ref="channelMonitor" />
    </template>
  </map-layout>
</template>

<style lang="scss" scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>

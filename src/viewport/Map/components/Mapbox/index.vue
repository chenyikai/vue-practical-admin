<script>
export default {
  name: "MapBox",
};
</script>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { shipInfoStore } from "@/store";
// import { trackData, shipData } from "./data";
// import Plot from "plugins/composition/Plot";
const ShipInfoStore = shipInfoStore();

const map = ref({});
const loading = ref(false);

function _onClick(e) {
  ShipInfoStore.show(e.id);
}

function initMap() {
  const options = {
    container: "map",
    zoom: 16,
    center: [122.144129, 29.95553],
  };
}

onBeforeUnmount(() => {});

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

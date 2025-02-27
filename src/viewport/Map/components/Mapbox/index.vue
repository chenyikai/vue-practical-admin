<script>
export default {
  name: "MapBox",
};
</script>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import init, { Mapbox, MapboxShip, MapboxDraw } from "plugins/index.js";
import { shipInfoStore } from "@/store";
import { stringify } from "wellknown";
// import { trackData, shipData } from "./data.js";
// import Plot from "plugins/composition/Plot";
const ShipInfoStore = shipInfoStore();

const map = ref({});
const loading = ref(false);

function onClick(e) {
  ShipInfoStore.show(e.id);
}

function initMap() {
  const options = {
    container: "map",
    zoom: 16,
    center: [122.144129, 29.95553],
  };
  init(options, () => {
    // MapboxShip.init();

    Mapbox.getMap().resize();
    addWmsSource();

    // MapboxTrack.trackSetData(trackData, shipData, true);
    // const plot = new Plot({ map: Mapbox.getMap(), icons: {} });
    // plot.changeMode(Plot.DRAW_POINT, {});
    // MapboxDraw.changeMode("draw_point");
    MapboxDraw.on("graphical_create", (e) => {
      console.log(stringify(e.features[0]), "e");
    });
    MapboxShip.on("click", onClick);
  });
}

function addWmsSource() {
  Mapbox.getMap().addSource("wms-test-source", {
    type: "raster",
    // use the tiles option to specify a WMS tile source URL
    // https://docs.mapbox.comhttps://docs.mapbox.com/style-spec/reference/sources/
    tiles: [
      "https://www.sinochemlogistics.com/iserver/services/map-as1211/wms130/tanks",
    ],
    tileSize: 256,
  });

  Mapbox.getMap().addLayer({
    id: "wms-test-layer",
    type: "raster",
    source: "wms-test-source",
    paint: {},
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

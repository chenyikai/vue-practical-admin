<script>
export default {
  name: "MapBox",
};
</script>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import init, { Mapbox, MapboxShip } from "plugins/index.js";
import { shipInfoStore } from "@/store";
// import { trackData, shipData } from "./data.js";
// import Plot from "plugins/composition/Plot";
import usePerson from "@/hooks/usePerson.js";
import useAnimateMarker from "@/hooks/useAnimateMarker.js";
import useSocket from "@/hooks/useSocket.js";

const ShipInfoStore = shipInfoStore();

const { PERSON_SET, PERSON_DELETE, onPosition } = usePerson();
const { initSocket } = useSocket();
const { init: initAnimateMarker, setMarker, deleteMarker } = useAnimateMarker();

const map = ref({});
const loading = ref(false);

function onClick(e) {
  ShipInfoStore.show(e.id);
}

function initMap() {
  const options = {
    container: "map",
    center: [121.62128348, 31.34950943],
    bearing: 309.18,
    zoom: 17,
  };
  init(options, () => {
    // MapboxShip.init();
    // MapboxShip.on("click", onClick);

    Mapbox.getMap().resize();
    const { Marker } = Mapbox.getEhhGis();
    initAnimateMarker({
      Marker,
      map: Mapbox.getMap(),
    });

    const url =
      "ws://localhost:9999/ZhanSocket/safetyjapi/ppm/socketServer/shanghaizhongyuanhai";
    initSocket(url, onMessage);

    // animateZoom();
    loading.value = false;
  });
}

function animateZoom(cb) {
  const zoom = Mapbox.getMap().getZoom();
  if (zoom >= 17) {
    cb && cb();
    return;
  }

  Mapbox.getMap().setZoom(zoom + 0.02);
  window.requestAnimationFrame(animateZoom);
}

function onMessage(val) {
  if (val.type === "position") {
    onPosition(val).then(({ type, data }) => {
      if (type === PERSON_DELETE) {
        deleteMarker(data.cardId);
      } else if (type === PERSON_SET) {
        setMarker(data);
      }
    });
  }
}

onBeforeUnmount(() => {
  MapboxShip.off("click", onClick);

  MapboxShip.destroy();
  Mapbox.destroy();
});

onMounted(() => {
  loading.value = true;
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

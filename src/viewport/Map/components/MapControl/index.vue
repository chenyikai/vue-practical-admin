<script>
export default {
  name: "MapControl",
};
</script>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { Mapbox } from "plugins";
import { formatLatitudeAndLongitude } from "@/utils/util.js";
defineOptions({
  name: "MapControl",
});

const mousePositionInfo = ref("");
const zoomInfo = ref("");

function zoomIn() {
  if (!Mapbox.getMap().isZooming()) {
    Mapbox.getMap().zoomIn();
  }
}

function zoomOut() {
  if (!Mapbox.getMap().isZooming()) {
    Mapbox.getMap().zoomOut();
  }
}

function onMouseMove(e) {
  const coordinate = e.lngLat.wrap();
  const { longitude, latitude } = formatLatitudeAndLongitude(
    coordinate.lng,
    coordinate.lat,
  );
  mousePositionInfo.value = `${latitude.completeValue} ${longitude.completeValue}`;
}

function onZoom() {
  zoomInfo.value = Mapbox.getMap().getZoom().toFixed(3);
}

onMounted(() => {
  Mapbox.mapLoaded().then(() => {
    zoomInfo.value = Mapbox.getMap().getZoom().toFixed(3);
  });
  Mapbox.getMap().on("mousemove", onMouseMove);
  Mapbox.getMap().on("zoom", onZoom);
});

onUnmounted(() => {
  Mapbox.getMap().off("mousemove", onMouseMove);
  Mapbox.getMap().off("zoom", onZoom);
});
</script>

<template>
  <section class="map-control-container">
    <div class="zoom-control">
      <img
        class="btn"
        src="@/assets/images/map/plus.png"
        alt=""
        @click.stop="zoomIn" />
      <img
        class="btn"
        src="@/assets/images/map/minus.png"
        alt=""
        @click.stop="zoomOut" />
    </div>
    <div class="mouse-position-control">
      {{ mousePositionInfo || "移动初始化" }}
    </div>
    <div class="zoom-position-control">
      {{ zoomInfo ? `${zoomInfo} 层` : "地图初始化" }}
    </div>
  </section>
</template>

<style scoped lang="scss">
.map-control-container {
  display: flex;
  align-items: center;
  position: absolute;
  left: 12px;
  bottom: 12px;
  z-index: 10000;
  pointer-events: auto;
  .zoom-control {
    display: flex;
    margin-right: 3px;
    .btn {
      width: 30px;
      height: 30px;
      cursor: pointer;
      transition: transform 0.3s;
      &:hover {
        transform: scale(1.1);
      }
      & + .btn {
        margin-left: 3px;
      }
    }
  }
  .mouse-position-control {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 268px;
    height: 30px;
    background-color: rgba($color: #2b2c39, $alpha: 0.5);
    border-radius: 6px;
    font-size: 14px;
    color: #fff;
  }
  .zoom-position-control {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 168px;
    height: 30px;
    background-color: rgba($color: #2b2c39, $alpha: 0.5);
    border-radius: 6px;
    font-size: 14px;
    color: #fff;
    margin-left: 3px;
  }
}
</style>

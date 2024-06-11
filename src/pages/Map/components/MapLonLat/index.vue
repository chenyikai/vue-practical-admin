<script>
export default {
    name: "LonlatBox",
};
</script>

<script setup>
import { formatLatitudeAndLongitude } from "@/utils/util";
import { ref, onUnmounted } from "vue";

let lon = ref("");
let lat = ref("");
function handleLonLat(e) {
    let lngLat = formatLatitudeAndLongitude(e.lngLat.lng, e.lngLat.lat);
    lon.value = lngLat.longitude.completeValue;
    lat.value = lngLat.latitude.completeValue;
}
function getMapLonLat() {
    const lonlat = formatLatitudeAndLongitude(
        window.map.getCenter().lng,
        window.map.getCenter().lat
    );
    lon.value = lonlat.longitude.completeValue;
    lat.value = lonlat.latitude.completeValue;

    window.map.on("mousemove", (e) => {
        handleLonLat(e);
    });
}

onUnmounted(() => {
    window.map.off("mousemove", (e) => {
        handleLonLat(e);
    });
});
defineExpose({
    getMapLonLat,
});
</script>

<template>
    <div class="lonlat-box">
        <div class="text-box">经度: {{ lon }}</div>
        <div class="text-box">纬度: {{ lat }}</div>
    </div>
</template>

<style scoped lang="scss">
.lonlat-box {
    position: absolute;
    opacity: 0.8;
    user-select: none;
    pointer-events: all;
    left: 10px;
    bottom: 0;
    width: 160px;
    height: 50px;
    background: white;
    border-radius: 10px;
    color: #000;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: space-evenly;
    padding: 5px;
    .text-box {
        font-size: 13px;
    }
}
</style>

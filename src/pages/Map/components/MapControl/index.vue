<script>
export default {
    name: "MapControl",
};
</script>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { formatLatitudeAndLongitude } from "@/utils/util.js";
import { Mapbox } from "@/plugins";
import { getDetailOne } from "@/pages/Map/components/SideBar/api";
defineOptions({
    name: "MapControl",
});

const mousePositionInfo = ref("");

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
let zoom = ref("");
function onMouseMove(e) {
    const coordinate = e.lngLat.wrap();
    zoom.value = window.map.getZoom();
    const { longitude, latitude } = formatLatitudeAndLongitude(
        coordinate.lng,
        coordinate.lat
    );
    switch (dfm.value) {
        case 1:
            return (mousePositionInfo.value = `${latitude.fmtValue.originValue.toFixed(6)} ${latitude.nameEn} ${longitude.fmtValue.originValue.toFixed(6)} ${longitude.nameEn} `);
        case 2:
            return (mousePositionInfo.value = `${latitude.fmtValue.degreeMinute} ${latitude.nameEn} ${longitude.fmtValue.degreeMinute} ${longitude.nameEn} `);
        case 3:
            return (mousePositionInfo.value = `${latitude.completeValue} ${longitude.completeValue}`);
        default:
            break;
    }
}
let dfm = ref(undefined);
onMounted(() => {
    getDetailOne().then(({ data }) => {
        const { dfmgs } = data.data;
        dfm.value = dfmgs;
    });
    setTimeout(() => {
        Mapbox.getMap().on("mousemove", onMouseMove);
    }, 1000);
});

onUnmounted(() => {
    Mapbox.getMap().off("mousemove", onMouseMove);
});
</script>

<template>
    <section class="map-control-container">
        <div class="zoom-control">
            <img
                class="btn"
                src="@/assets/images/map/plus.png"
                alt=""
                @click.stop="zoomIn"
            />
            <img
                class="btn"
                src="@/assets/images/map/minus.png"
                alt=""
                @click.stop="zoomOut"
            />
        </div>
        <div class="mouse-position-control">
            {{ mousePositionInfo || "移动初始化" }}
        </div>
        <div class="mouse-position">
            <div>层级:{{ zoom }}</div>
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
        margin-right: 10px;
    }
    .mouse-position {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 208px;
        height: 30px;
        background-color: rgba($color: #2b2c39, $alpha: 0.5);
        border-radius: 6px;
        font-size: 14px;
        color: #fff;
    }
}
</style>

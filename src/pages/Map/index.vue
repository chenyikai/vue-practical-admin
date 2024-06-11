<script>
export default {
    name: "MapPage",
};
</script>

<script setup>
import MapLayout from "@/pages/Map/components/MapLayout/index.vue";
import MapBox from "@/pages/Map/components/Mapbox/index.vue";
import MapControl from "@/pages/Map/components/MapControl/index.vue";
import SideBar from "@/pages/Map/components/SideBar/index.vue";
import MapSwitch from "@/pages/Map/components/MapboxSwitch/index.vue";
import Legend from "@/pages/Map/components/MapLegend/index.vue";

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
            <map-control />
            <side-bar />
            <map-switch />
            <Legend />
        </template>
    </map-layout>
</template>

<style lang="scss" scoped>
#map {
    width: 100%;
    height: 100%;
}
</style>

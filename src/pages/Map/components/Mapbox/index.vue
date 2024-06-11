<script>
export default {
    name: "MapBox",
};
</script>

<script setup>
import {
    getPoiList,
    getDetailOne,
    getAllWithPoiAnJi,
    getAllWithPoi,
    getPagepoiTType,
    getPagepoiTTypeShore,
} from "@/pages/Map/components/SideBar/api";
import { ref, onMounted } from "vue";
import init, { Mapbox, MapboxLayer } from "@/plugins/index";
import SearchBar from "../SearchBar/index.vue";
import { getStore, setStore } from "@/utils/store";
const map = ref({});
const loading = ref(false);
function getDetail() {
    return Promise.all([
        getDetailOne(),
        getAllWithPoiAnJi(),
        getAllWithPoi(),
        getPagepoiTType(),
        getPagepoiTTypeShore(),
    ]).then(([detail, anJiList, seaList, seaType, anJiType]) => {
        let type = [...seaType.data.data.rows, ...anJiType.data.data.rows];
        const { lng, lat, dfmgs, mrcj, mrty, poiTypeCode, shoreTypeCode } =
            detail.data.data;
        let center = [];
        let zoom;
        if (lng && lat) {
            center = [lng, lat];
            zoom = mrcj - 1;
        }
        let anJiArr = [];
        let seaArr = [];
        if (shoreTypeCode) {
            anJiArr = anJiList.data.data.filter(
                (item) => JSON.parse(shoreTypeCode).includes(item.code) === true
            );
        }

        if (poiTypeCode) {
            seaArr = seaList.data.data.filter(
                (item) => JSON.parse(poiTypeCode).includes(item.code) === true
            );
        }
        return { center, zoom, mrty, dfmgs, anJiArr, seaArr, type };
    });
}

function initMap(config) {
    const options = {
        container: "map",
        ...config,
    };
    const { anJiArr, seaArr, type } = config;
    let anjiList = anJiArr.map((item) => item.shorePoiTInfoList).flat();
    let seaList = seaArr.map((item) => item.poiTInfoList).flat();
    let arr = [...anjiList, ...seaList];
    arr = arr.map((item) => {
        let ele = type.find((i) => i.code == item.typeCode);
        return {
            ...item,
            icon: ele.icon || "",
        };
    });
    init(options, () => {
        // addScale(data); //比例尺
        getPoiList().then(({ data }) => {
            MapboxLayer.render(MapboxLayer.handleAllTypeLayer(arr));
        });
        Mapbox.getMap().resize();
    });
}

// function addScale({ map, ehhGis }) {
//   const scale = new ehhGis.scale();
//   map.addControl(scale, "bottom-left");
// }

onMounted(() => {
    let isReload = getStore({ name: "isReload" });
    if (!isReload) {
        window.location.reload();
        setStore({ name: "isReload", content: 1 });
    }
    getDetail().then((data) => {
        initMap(data);
    });
});
</script>

<template>
    <div v-loading="loading" ref="map" id="map" />
    <div class="switch">
        <MapSwitch />
    </div>
    <div class="search"><SearchBar /></div>
    <!-- <div class="lonlat">
        <MapLonLat ref="lonlat" />
    </div> -->
</template>

<style scoped lang="scss">
#map {
    width: 100%;
    height: 100%;
}
.switch {
    position: relative;
    top: -20px;
    left: -50px;
}
.lonlat {
    position: absolute;
    right: 235px;
    bottom: 88px;
}
.search {
    position: absolute;
    left: 380px;
    top: 10px;
}
</style>

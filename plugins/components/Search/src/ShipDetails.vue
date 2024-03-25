<template>
  <div class="ship-details-box" v-show="isSearch">
    <div class="details-box" v-loading="loading">
      <DetailsTopBtn ref="detailsTop" @inter="onBtnInter" />
      <div class="divider-box"></div>
      <DetailsShipInfo v-show="interKey === 1" ref="shipInfo" />
      <DetailsShipTrack
        v-show="interKey === 2"
        ref="shipTrack"
        @passData="handlePassData" />
    </div>
    <TrackList ref="trackList" />
    <div class="close-btn" @click="handleDetailClose" v-show="isSearch">
      收起
    </div>
  </div>
</template>

<script>
import { getShipPoiByMmsi } from "@/api/search.js";
import MapboxShip from "@/plugins/composition/mapbox-ship";
import MapboxShipTrack from "@/plugins/composition/mapbox-ship-track";
import DetailsTopBtn from "@/components/map-ship-details/DetailsTopBtn.vue";
import DetailsShipInfo from "@/components/map-ship-details/DetailsShipInfo.vue";
import DetailsShipTrack from "@/components/map-ship-details/DetailsShipTrack.vue";
import TrackList from "@/components/map-ship-details/TrackList.vue";
import Mapbox from "@/plugins/composition/mapbox";

export default {
  name: "ShipDetails",
  components: { DetailsTopBtn, DetailsShipInfo, DetailsShipTrack, TrackList },
  data() {
    return {
      loading: true,
      isSearch: false,
      interKey: 1,
      mmsi: null,
      formData: {},
    };
  },
  mounted() {
    // 监听地图船舶点击事件
    MapboxShip.on("focus", this.open);
  },
  methods: {
    open(mmsi) {
      console.log(mmsi, ">>> MMSI");
      this.loading = true;
      this.mmsi = mmsi;
      this.$refs.detailsTop.onBtnClick(1);
      this.isSearch = true;
      this.getList();
    },
    getList() {
      this.loading = true;
      if (this.interKey === 1) {
        this.handlePassData([]);
        getShipPoiByMmsi({ mmsi: this.mmsi }).then(({ data }) => {
          this.formData = data.data;
          this.$refs.shipInfo.open(this.formData);
          this.loading = false;
          MapboxShip.setFocus(this.mmsi);
        });
      } else {
        this.$refs.shipTrack.open({ mmsi: this.mmsi });
        this.loading = false;
      }
    },
    onBtnInter(ref) {
      this.interKey = ref;
      this.closeMap();
      this.getList();
    },
    handleDetailClose() {
      this.loading = true;
      this.isSearch = false;
      this.mmsi = null;
      this.listQuery = {};
      this.closeMap();
      Mapbox.aim();
    },
    handlePassData(data) {
      this.$refs.trackList.open(data);
    },
    closeMap() {
      MapboxShip.setFocus();
      MapboxShipTrack.hide();
    },
  },
  beforeDestroy() {
    MapboxShip.off("focus", this.open);
    this.closeMap();
  },
};
</script>

<style lang="scss" scoped>
.ship-details-box {
  width: 100%;
  .details-box {
    width: 100%;
    height: 350px;
    max-height: 350px;
    background-color: #fff;
    box-shadow: 0px 0px 4px 0px rgba(1, 24, 68, 0.19);
    border-radius: 4px;
    padding: 14px 17px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    .divider-box {
      width: 100%;
      border: 1px solid #d2d2d2;
      border-width: 1px;
      border-style: dashed;
      margin: 12px 0 5px;
      padding: 0 3px;
    }
  }
  .close-btn {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background-color: #e7e7e7;
    color: #000;
    font-size: 12px;
    cursor: pointer;
  }
}
</style>

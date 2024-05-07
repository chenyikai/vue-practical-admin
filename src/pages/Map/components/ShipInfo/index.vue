<script>
export default {
  name: "ShipInfo",
};
</script>

<script setup>
import { ref, computed } from "vue";
import { CircleClose } from "@element-plus/icons-vue";
import ComponentBox from "@/pages/Map/ComponentBox.vue";
import { shipInfoStore } from "@/store";
const ShipInfoStore = shipInfoStore();

defineOptions({
  name: "ShipInfo",
});

const activeStep = ref(1);
const detailTypeList = [
  {
    id: 1,
    label: "船舶信息",
    component: "ShipInfoComponent",
  },
  {
    id: 2,
    label: "AIS信息",
    component: "AisInfoComponent",
  },
  {
    id: 3,
    label: "每日油耗",
    component: "DailyOilComponent",
  },
  {
    id: 4,
    label: "气象信息",
    component: "MeteorologicalInfoComponent",
  },
];

const translateX = computed(
  () =>
    `translateX(${detailTypeList.findIndex((t) => t.id === activeStep.value) * 80 + 12}px)`,
);

function onChange(val) {
  activeStep.value = val.id;
}
</script>

<template>
  <component-box
    class="ship-info-control"
    v-draggable:ship-info-container-header
    v-if="ShipInfoStore.visible"
    :zIndex="ShipInfoStore.zIndex">
    <section class="ship-info-container">
      <header class="ship-info-container-header">
        <div class="title-layout">
          <span class="ship-name">{{
            `${ShipInfoStore.shipData.cnname || ShipInfoStore.shipData.enname || ShipInfoStore.shipData.mmsi || "暂无数据"}`
          }}</span>
        </div>
        <div class="func-layout">
          <el-icon class="close-btn"><CircleClose /></el-icon>
        </div>
      </header>
      <nav class="ship-info-container-nav">
        <div
          class="ship-info-container-nav-item"
          v-for="item in detailTypeList"
          :key="item.id"
          :class="{ cur: item.key === activeStep }"
          @click="onChange(item)">
          {{ item.label }}
        </div>
        <div class="slider-tab" :style="{ transform: translateX }" />
      </nav>
      <main class="ship-info-container-main"></main>
      <footer class="ship-info-container-footer"></footer>
    </section>
  </component-box>
</template>

<style scoped lang="scss">
.ship-info-control {
  position: absolute;
  top: 65px;
  right: 12px;
  width: 340px;
  .ship-info-container {
    width: 100%;
    padding: 5px;
    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 30px;
      padding: 0 13px;
      border-bottom: 1px solid;
      border-image: linear-gradient(
          90deg,
          rgba($color: #959595, $alpha: 0.2),
          rgba($color: #fff, $alpha: 0.5),
          rgba($color: #959595, $alpha: 0.2)
        )
        1 1;
      .title-layout {
        font-size: 14px;
        .ship-name {
          color: #fff;
        }
      }
      .close-btn {
        font-size: 18px;
        cursor: pointer;
      }
    }
    &-nav {
      position: relative;
      width: 100%;
      height: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #fff;
      font-size: 14px;
      border-bottom: 1px solid;
      border-image: linear-gradient(
          90deg,
          rgba($color: #959595, $alpha: 0.2),
          rgba($color: #fff, $alpha: 0.5),
          rgba($color: #959595, $alpha: 0.2)
        )
        1 1;

      &-item {
        width: 80px;
        text-align: center;
        overflow: hidden;
        cursor: pointer;
      }

      .slider-tab {
        position: absolute;
        bottom: 0;
        width: 56px;
        height: 5px;
        background: linear-gradient(90deg, #5887d4 0%, #65cbe4 100%);
        z-index: 1;
        transition: transform 0.5s;
        &:before {
          position: absolute;
          left: 0;
          right: 0;
          margin: auto;
          top: -2px;
          content: "";
          display: block;
          width: 4px;
          height: 4px;
          background: linear-gradient(90deg, #5887d4 0%, #65cbe4 100%);
          transform: rotate(45deg);
        }
      }
    }
    &-footer {
      display: flex;
      align-items: center;
      width: 100%;
      height: 52px;
      background-color: rgba($color: #191929, $alpha: 0.8);
    }
  }
}
</style>

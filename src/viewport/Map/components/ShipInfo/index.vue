<script>
export default {
  name: "ShipInfo",
};
</script>

<script setup>
import { ref, computed, onMounted } from "vue";
import { CircleClose } from "@element-plus/icons-vue";
import ComponentBox from "../../../Map/ComponentBox.vue";
import { shipInfoStore } from "@/store";
import { ElMessageBox } from "element-plus";

const ShipInfoStore = shipInfoStore();

defineOptions({
  name: "ShipInfo",
});

const activeStep = ref(1);
const attention = ref(0);
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
];

const translateX = computed(() => {
  const width =
    detailTypeList.findIndex((t) => t.id === activeStep.value) * 80 + 12;
  return `translateX(${width * (window.innerWidth / 1920)}px)`;
});

function onChange(val) {
  activeStep.value = val.id;
}

function onAttentionChange(val) {
  const label = val === 0 ? "取消关注" : "关注";

  ElMessageBox.confirm(
    `请确认是否${label}${ShipInfoStore.shipData.cnname || ShipInfoStore.shipData.enname || ShipInfoStore.shipData.mmsi}？`,
    "提示",
    {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    },
  )
    .then(() => {})
    .catch(() => {
      attention.value = val === 0 ? 1 : 0;
    });
}

onMounted(() => {
  attention.value = ShipInfoStore.isOwn ? 1 : 0;
});
</script>

<template>
  <component-box
    class="ship-info-control"
    id="shipInfo"
    v-draggable:ship-info-container-header
    :loading="ShipInfoStore.loading"
    :zIndex="ShipInfoStore.zIndex">
    <section class="ship-info-container">
      <header class="ship-info-container-header">
        <div class="title-layout">
          <span class="ship-name">{{
            `${ShipInfoStore.shipData.cnname || ShipInfoStore.shipData.enname || ShipInfoStore.shipData.mmsi || "暂无数据"}`
          }}</span>
        </div>
        <div class="func-layout">
          <el-rate
            v-model="attention"
            :max="1"
            clearable
            @change="onAttentionChange" />
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
      <footer class="ship-info-container-footer">
        <div class="ship-info-container-footer-item"></div>
      </footer>
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
    padding: 5px 0 0;
    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 30px;
      padding: 0 10px;
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
      align-items: center;
      color: #fff;
      font-size: 12px;
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
        height: 4px;
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
      border-radius: 0 0 6px 6px;
      background-color: rgba($color: #191929, $alpha: 0.8);
      overflow: hidden;
      &-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 25%;
        height: 100%;
        color: #fff;
        cursor: pointer;
        &.cur {
          background-color: #4f576a;
        }
        &:hover {
          background-color: #4f576a;
        }
        .icon {
          font-size: 18px;
          margin-bottom: 4px;
        }
        .label {
          font-size: 12px;
        }
      }
    }
  }
}
</style>

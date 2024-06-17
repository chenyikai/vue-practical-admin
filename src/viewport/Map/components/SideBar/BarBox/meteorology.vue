<script setup>
import Df from "@/assets/images/map/qxImage/df.png";
import DfOn from "@/assets/images/map/qxImage/df-on.png";
import Tf from "@/assets/images/map/qxImage/tf.png";
import TfOn from "@/assets/images/map/qxImage/tf-on.png";
import Ycyb from "@/assets/images/map/qxImage/ycyb.png";
import YcybOn from "@/assets/images/map/qxImage/ycyb-on.png";
import Rydqx from "@/assets/images/map/qxImage/rydqx.png";
import RydqxOn from "@/assets/images/map/qxImage/rydcx-on.png";
import Cx from "@/assets/images/map/qxImage/cx.png";
import CxOn from "@/assets/images/map/qxImage/cx-on.png";
import { mapStore } from "@/store/index.js";

import { ref } from "vue";
defineOptions({
  name: "MeteorologyBox",
});

const MapStore = mapStore();
const drawer = ref(false);
const dataId = ref(null);
const dataList = ref([
  {
    id: 1,
    name: "大风",
    ofurl: Df,
    onurl: DfOn,
  },
  {
    id: 2,
    name: "台风",
    ofurl: Tf,
    onurl: TfOn,
  },
  {
    id: 3,
    name: "渔场预报",
    ofurl: Ycyb,
    onurl: YcybOn,
  },
  {
    id: 4,
    name: "任意点气象",
    ofurl: Rydqx,
    onurl: RydqxOn,
  },
  {
    id: 5,
    name: "潮汐",
    ofurl: Cx,
    onurl: CxOn,
  },
]);

function open(type = true) {
  drawer.value = type;
}

function handleClick(data) {
  if (data.id && data.id === dataId.value) {
    dataId.value = null;
    MapStore.$state.qxType = null;
  } else {
    dataId.value = data.id;
    MapStore.$state.qxType = data.id;
    drawer.value = false;
  }
}

defineExpose({
  open,
});
</script>

<template>
  <div class="meteorology-box">
    <el-drawer
      :append-to-body="true"
      v-model="drawer"
      direction="rtl"
      size="20%">
      <template #header="{ titleId, titleClass }">
        <div :id="titleId" :class="`${titleClass} drawer-title-text`">
          气象相关
        </div>
      </template>
      <div class="button-meteorology-list-box">
        <div
          class="button-from"
          v-for="item in dataList"
          :key="item.id"
          @click.stop="handleClick(item)">
          <div
            class="button-list"
            :class="item.id === dataId ? 'button-list-on' : ''">
            <img :src="item.onurl" :alt="item.name" class="image-box" />
            <div class="text-box">{{ item.name }}</div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<style scoped lang="scss">
.meteorology-box {
  position: relative;
  ::v-global(.drawer-title-text) {
    font-size: 17px;
    color: #bdc3c7;
  }
}
.button-meteorology-list-box {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  padding: 0 !important;
  .button-from {
    margin-bottom: 25px;
    .button-list {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      height: 70px;
      box-sizing: border-box;
      user-select: none;
      background-image: url(@/assets/images/map/qxImage/Background.png);
      //background-size: contain;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      cursor: pointer;
      .image-box {
        position: absolute;
        left: 24px;
        $size: 25px;
        width: $size;
        height: $size;
      }
      .text-box {
        padding-left: 80px;
        font-size: 17px;
        color: #ecf0f1;
      }
    }
    .button-list-on {
      background-image: url(@/assets/images/map/qxImage/Background-on.png);
      .text-box {
        color: white;
      }
    }
  }
}
</style>

<script>
export default {
  name: "componentName",
};
</script>

<script setup>
import Icon from "./IconItem/index.vue";
import { ref } from "vue";
const legendList = [
  {
    label: "默认图标",
    url: new URL(`@/plugins/assets/plot/point.png`, import.meta.url),
  },
  {
    label: "边检",
    url: new URL(`@/icons/mapIcon/bianjian.png`, import.meta.url),
  },
  {
    label: "泊位",
    url: new URL(`@/icons/mapIcon/bowei.png`, import.meta.url),
  },
  {
    label: "船舶代理",
    url: new URL(`@/icons/mapIcon/chuanbodaili.png`, import.meta.url),
  },
  {
    label: "船舶维修",
    url: new URL(`@/icons/mapIcon/chuanboweixiu.png`, import.meta.url),
  },
  {
    label: "船供公司",
    url: new URL(`@/icons/mapIcon/chuangonggongsi.png`, import.meta.url),
  },
  {
    label: "船坞",
    url: new URL(`@/icons/mapIcon/chuanwu.png`, import.meta.url),
  },
  {
    label: "港务部门",
    url: new URL(`@/icons/mapIcon/gangwubumen.png`, import.meta.url),
  },
  {
    label: "供油服务",
    url: new URL(`@/icons/mapIcon/gongyoufuwu.png`, import.meta.url),
  },
  {
    label: "海关",
    url: new URL(`@/icons/mapIcon/haiguan.png`, import.meta.url),
  },
  {
    label: "海事",
    url: new URL(`@/icons/mapIcon/haishi.png`, import.meta.url),
  },
  {
    label: "码头",
    url: new URL(`@/icons/mapIcon/matou.png`, import.meta.url),
  },
  {
    label: "能源企业",
    url: new URL(`@/icons/mapIcon/nengyuanqiye.png`, import.meta.url),
  },
  {
    label: "图书资料",
    url: new URL(`@/icons/mapIcon/tushuziliao.png`, import.meta.url),
  },
  {
    label: "应急",
    url: new URL(`@/icons/mapIcon/yingji.png`, import.meta.url),
  },
  {
    label: "渔港",
    url: new URL(`@/icons/mapIcon/yugang.png`, import.meta.url),
  },
  {
    label: "渔业",
    url: new URL(`@/icons/mapIcon/yuye.png`, import.meta.url),
  },
  {
    label: "造船企业",
    url: new URL(`@/icons/mapIcon/zaochuanqiye.png`, import.meta.url),
  },
];
let show = ref(false);
</script>

<template>
  <div class="layout">
    <div class="button" @click="show = !show">
      <img src="@/assets/images/map/legend.png" alt="" />
    </div>
    <div class="legend" v-if="show">
      <Icon
        v-for="item in legendList"
        :key="item.label"
        :title="item.label"
        :url="item.url" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.layout {
  position: absolute;
  left: 10px;
  bottom: 50px;
  display: flex;
  .button {
    position: absolute;
    left: 0px;
    bottom: 85px;

    width: 55px;
    // height: 35px;
    // background-color: #484a5e;
    cursor: pointer;
    pointer-events: auto;
    border-radius: 10px;
    margin-right: 10px;
    transition: all 0.3s;
    &:hover {
      transform: scale(1.05);
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.legend {
  border-radius: 10px;
  margin-left: 60px;
  color: #000;
  background-color: #fff;
  width: 820px;
  height: 140px;
  padding: 10px;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 10px;
}
</style>

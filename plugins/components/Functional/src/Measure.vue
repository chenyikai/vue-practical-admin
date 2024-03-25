<template>
  <div class="measure-box">
    <div
      class="measure"
      v-for="item in toolsList"
      :key="item.id"
      @click="handleClick(item)">
      <div class="icon-layout">
        <em class="icon iconfont" :class="item.icon" />
      </div>
      <span class="label">{{ item.label }}</span>
    </div>
  </div>
</template>

<script>
import { baseMap } from "@/plugins/mapConfig";
import MapboxMeasure from "@/plugins/composition/mapbox-measure";
export default {
  name: "MeasureBox",
  data() {
    return {
      baseMap,
      toolsList: [
        {
          id: 1,
          label: "测距",
          icon: "icon-distance",
          name: "distance",
        },
        {
          id: 2,
          label: "面积",
          name: "area",
          icon: "icon-area",
        },
        {
          id: 3,
          label: "方位",
          name: "position",
          icon: "icon-position-line",
        },
      ],
    };
  },
  methods: {
    handleClick(item) {
      MapboxMeasure.closeAll();
      MapboxMeasure.measureLayer(item.name);
    },
  },
};
</script>

<style scoped lang="scss">
.measure-box {
  display: flex;
  align-items: center;
  width: max-content;
  .measure {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    border-radius: 8px;
    background-color: #fff;
    border: 1px solid #fcfcfc;
    transition: all 0.3s;
    cursor: pointer;
    &:hover {
      transform: scale(1.2);
    }
    .icon-layout {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 30px;
      margin-bottom: 5px;
    }
    .label {
      font-size: 14px;
    }
  }
}
</style>

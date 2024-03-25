<script>
import Mapbox from "@/plugins/composition/mapbox";

export default {
  name: "Functional",
  data() {
    return {
      functionalList: [
        {
          id: 1,
          label: "标绘",
          ref: "plot",
          icon: "icon-plot",
          trigger: "click",
          visible: false,
          data: {
            plot: [],
          },
          component: () => import("./PlotBox.vue"),
        },
        {
          id: 2,
          label: "测量",
          ref: "measure",
          trigger: "click",
          icon: "icon-measure",
          visible: false,
          component: () => import("./Measure.vue"),
        },
        {
          id: 3,
          label: "工具",
          ref: "tool",
          icon: "icon-tools",
          trigger: "click",
          visible: false,
          data: {
            fence: [],
            stopReport: [],
          },
          component: () => import("./Tools.vue"),
        },
        {
          id: 4,
          label: "船舶",
          ref: "tool",
          icon: "icon-ship-manage",
          trigger: "click",
          visible: false,
          data: {
            fence: [],
            stopReport: [],
          },
          component: () => import("./Ship.vue"),
        },
        {
          id: 5,
          label: "增加",
          ref: "setup",
          icon: "icon-plus",
          trigger: "click",
          visible: false,
          component: null,
          onClick: () => {
            Mapbox.zoomIn();
          },
        },
        {
          id: 6,
          label: "减少",
          ref: "setup",
          icon: "icon-minus",
          trigger: "click",
          visible: false,
          component: null,
          onClick: () => {
            Mapbox.zoomOut();
          },
        },
        {
          id: 7,
          label: "定位",
          ref: "setup",
          icon: "icon-aim",
          trigger: "click",
          visible: false,
          component: null,
          onClick: () => {
            Mapbox.aim();
          },
        },
        {
          id: 8,
          label: "设置",
          ref: "setup",
          icon: "icon-shezhi",
          trigger: "click",
          visible: false,
          component: () => import("./Setup.vue"),
        },
      ],
    };
  },
  methods: {
    handlePlayBack(val) {
      console.log(val);
    },
  },
};
</script>

<template>
  <div class="functional-container">
    <template v-for="item in functionalList">
      <el-popover
        v-if="item.component"
        popper-class="functional-popover"
        :key="item.id"
        placement="left"
        :title="item.label"
        :trigger="item.trigger">
        <div class="component-box">
          <component
            :ref="item.ref"
            :is="item.component"
            :value="item.data"
            @play-back="handlePlayBack" />
        </div>
        <div
          class="functional"
          slot="reference"
          @click="item.visible = !item.visible">
          <em class="icon iconfont" :class="item.icon" />
          <span class="label">{{ item.label }}</span>
        </div>
      </el-popover>
      <div
        v-else
        :key="item.id"
        class="functional"
        slot="reference"
        @click="item.onClick()">
        <em class="icon iconfont" :class="item.icon" />
        <span class="label">{{ item.label }}</span>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.functional-container {
  position: absolute;
  top: 16px;
  right: 23px;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: auto;
  gap: 10px;
  .functional {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    border-radius: 8px;
    background-color: #fff;
    cursor: pointer;
    .icon {
      font-size: 24px;
      margin-bottom: 4px;
    }
    .label {
      font-size: 14px;
    }
  }
}
</style>

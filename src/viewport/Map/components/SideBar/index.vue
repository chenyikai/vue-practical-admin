<script>
export default {
  name: "SideBar",
};
</script>

<script setup>
import { reactive } from "vue";
defineOptions({
  name: "SideBar",
});

const emits = defineEmits(["click"]);

const sideBarList = reactive([
  {
    id: 1,
    label: "船舶",
    type: "ship",
    icon: new URL("@/assets/images/map/sideBar/ship.png", import.meta.url)[
      "href"
    ],
    component: "ship",
    active: false,
  },
  {
    id: 2,
    label: "气象",
    type: "weather",
    icon: new URL("@/assets/images/map/sideBar/weather.png", import.meta.url)[
      "href"
    ],
    component: "weather",
    active: false,
  },
  {
    id: 3,
    label: "图层",
    type: "layer",
    icon: new URL("@/assets/images/map/sideBar/layer.png", import.meta.url)[
      "href"
    ],
    component: "layer",
    active: false,
  },
  {
    id: 4,
    label: "工具",
    type: "tool",
    icon: new URL("@/assets/images/map/sideBar/tool.png", import.meta.url)[
      "href"
    ],
    component: "tool",
    active: false,
  },
  {
    id: 5,
    label: "图源",
    type: "layerSource",
    icon: new URL("@/assets/images/map/sideBar/source.png", import.meta.url)[
      "href"
    ],
    component: "layerSource",
    active: false,
  },
]);

function onClick(val) {
  emits("click", val);
}
</script>

<template>
  <ul class="side-bar-container">
    <li
      class="side-bar-item"
      v-for="item in sideBarList"
      :key="item.id"
      @click.stop="onClick(item)">
      <div class="icon-layout">
        <img :src="item.icon" :alt="item.label" />
      </div>
      <div class="text-layout">{{ item.label }}</div>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.side-bar-container {
  position: absolute;
  right: 0;
  bottom: 12px;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  .side-bar-item {
    display: flex;
    justify-content: flex-end;
    cursor: pointer;
    user-select: none;
    overflow: hidden;
    & + .side-bar-item {
      margin-top: 20px;
    }
    &.active,
    &:hover {
      &:after {
        background-color: transparent;
      }
      .text-layout {
        width: 88px;
      }
    }
    + .map-util-menu-item {
      margin-top: 20px;
    }
    .icon-layout {
      width: 48px;
      height: 48px;
      background-color: #8cc6fc;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      border: 2px solid #255d88;
      z-index: 1;
      img {
        width: 48px;
        height: 48px;
      }
    }
    .text-layout {
      height: 48px;
      width: 68px;
      background-color: #255d88;
      margin-left: -22px;
      z-index: 0;
      padding-left: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #ffffff;
      transition: all 0.3s;
    }
  }
}
</style>

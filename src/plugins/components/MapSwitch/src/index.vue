<script>
export default {
  name: "MapSwitch",
};
</script>

<template>
  <ul class="mapSwitch-container">
    <li
      v-for="(item, index) in baseMap"
      :key="index"
      :class="'map-switch-' + (index + 1)"
      @click="switchMap(item, index)">
      <img :src="item.img" alt="" />
      <span class="desc">{{ item.name }}</span>
    </li>
  </ul>
</template>

<script setup>
import { ref, defineEmits, defineProps } from "vue";
import { baseMap } from "@/plugins/mapConfig";

const baseMapRef = ref(baseMap);
const emit = defineEmits(["change"]);
const props = defineProps(["mapSwitchInstance"]);

const switchMap = (item, index) => {
  props.mapSwitchInstance.switchLayer(item.name);
  baseMapRef.value.splice(index, 1);
  baseMapRef.value.unshift(item);
  emit("change", item);
};
</script>

<style lang="scss" scoped>
.mapSwitch-container {
  position: absolute;
  right: 10px;
  bottom: 5px;
  //width: 100px;
  height: 50px;
  margin: 0;
  pointer-events: auto;

  &:hover {
    width: 400px;
    @for $var from 1 to 8 {
      .map-switch-#{$var} {
        right: (($var - 1) * 80px);
      }
    }
  }

  li {
    display: block;
    position: absolute;
    top: 0;
    width: 68px;
    height: 49px;
    text-align: center;
    cursor: pointer;
    background-color: white;
    border-radius: 4px;
    transition: all 0.3s;

    img {
      width: 100%;
      height: 100%;
      border-radius: 4px;
    }

    .desc {
      display: inline-block;
      position: absolute;
      right: 0;
      bottom: 0;
      font-size: 12px;
      padding: 0 5px;
      font-weight: 700;
      text-align: center;
      color: #fff;
      background-color: #357fa9;
      transition: all 0.2s;
      border-radius: 3px;
    }
  }

  @for $var from 1 to 8 {
    .map-switch-#{$var} {
      right: (($var - 1) * 14px);
      z-index: (100 - $var);
    }
  }
}
</style>

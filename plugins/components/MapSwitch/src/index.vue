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

<script>
import { baseMap } from "@/plugins/mapConfig";
import MapboxSwitch from "@/plugins/composition/mapbox-switch";

export default {
  name: "MapSwitch",
  data() {
    return {
      baseMap,
    };
  },
  methods: {
    switchMap(item, index) {
      MapboxSwitch.switchLayer(item.name);
      this.baseMap.splice(index, 1);
      this.baseMap.unshift(item);
      this.$emit("change", item);
    },
    watchLayer() {
      const initLayer = window.localStorage.getItem("sshdjg-admin-initLayer");
      const id = initLayer ? JSON.parse(initLayer).content : null;
      if (id) {
        const i = baseMap.findIndex((obj) => obj.id === id);
        if (i !== -1) {
          this.switchMap(baseMap[i], i);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.mapSwitch-container {
  position: absolute;
  right: 22px;
  bottom: -30px;
  width: 400px;
  height: 99px;
  margin: 0;
  pointer-events: auto;
  &:hover {
    width: 800px;
  }
  &:hover {
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
      right: (($var - 1) * 24px);
      z-index: (100 - $var);
    }
  }
}
</style>

<script>
export default {
  name: "ComponentBox",
};
</script>

<script setup>
import loadingIcon from "@/icons/loading.svg?raw";
defineOptions({
  name: "ComponentBox",
});
defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  zIndex: {
    type: Number,
    default: 2000,
  },
});
</script>

<template>
  <section class="component-box" :style="{ zIndex }">
    <main
      class="component-box-main"
      v-loading="loading"
      :element-loading-spinner="loadingIcon"
      element-loading-text="加载中"
      element-loading-svg-view-box="0 0 57 57">
      <slot></slot>
    </main>
  </section>
</template>

<style scoped lang="scss">
.component-box {
  background-color: rgba($color: #2b2c39, $alpha: 0.5);
  padding: 5px;
  border-radius: 6px;
  z-index: 100;
  pointer-events: all;
  &-main {
    width: 100%;
    height: 100%;
    background-color: rgba($color: #191929, $alpha: 0.8);
    border-radius: 6px;
  }
}
</style>

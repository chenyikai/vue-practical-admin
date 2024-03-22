<script>
export default {
  name: "VerticalStretchBox",
};
</script>

<script setup>
import { ref } from "vue";
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  leftWidth: {
    type: Number,
    default: 300,
    required: true,
  },
  animation: {
    type: Number,
    default: 300,
  },
  gap: {
    type: Number,
    default: 20,
  },
});

const _animation = ref(props.animation + "ms");
const _leftWidth = ref(props.leftWidth + "px");
const _gap = ref(props.gap + "px");
</script>

<template>
  <section class="vertical-stretch-box">
    <div class="left-layout" :class="{ show: visible }">
      <slot name="left"></slot>
    </div>
    <div class="right-layout" v-if="visible" :class="{ show: visible }">
      <slot name="right"></slot>
    </div>
  </section>
</template>

<style scoped lang="scss">
@import "src/styles/variables";
.vertical-stretch-box {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  .left-layout {
    width: 100%;
    height: 100%;
    overflow: hidden;
    @include container();
    transition: all v-bind(_animation);
    &.show {
      width: v-bind(_leftWidth);
      margin-right: v-bind(_gap);
    }
  }
  .right-layout {
    width: 0;
    height: 100%;
    overflow: hidden;
    @include container();
    border-radius: 4px;
    &.show {
      flex: 1;
      width: auto;
    }
  }
}
</style>

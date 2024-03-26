<script>
export default {
  name: "VerticalStretchBox",
};
</script>

<script setup>
import { useMousePressed } from "@vueuse/core";
import { computed, ref } from "vue";
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  leftWidth: {
    type: [Number, String],
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

const left = ref({});
const _animation = ref(props.animation + "ms");
const _leftWidth = computed(() => {
  if (typeof props.leftWidth === "number") return props.leftWidth + "px";
  if (typeof props.leftWidth === "string") return props.leftWidth;
  return props.leftWidth;
});
const _gap = ref(props.gap + "px");

function onMousemove() {
  const mousePress = useMousePressed({ target: left });
  console.log(mousePress.pressed.value, "pressed.value");
  // if (pressed.value) {
  //   const mouse = reactive(useMouseInElement(left));
  //   console.log(mouse);
  // }
}
</script>

<template>
  <section class="vertical-stretch-box">
    <div class="left-layout" ref="left" :class="{ show: visible }">
      <slot name="left"></slot>
    </div>
    <div
      v-if="false"
      ref="shrink"
      class="shrink-btn"
      @mousemove="onMousemove" />
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
    min-width: v-bind(_leftWidth);
    height: 100%;
    overflow: hidden;
    @include container();
    transition: all v-bind(_animation);
    &.show {
      width: v-bind(_leftWidth);
      margin-right: v-bind(_gap);
    }
  }
  .shrink-btn {
    position: absolute;
    left: v-bind(_leftWidth);
    width: v-bind(_gap);
    height: 100%;
    cursor: col-resize;
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

<script>
export default {
  name: "VerticalStretchBox",
};
</script>

<script setup>
import { useMouse } from "@vueuse/core";
import { ref, watch } from "vue";
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  leftWidth: {
    type: String,
    default: "300px",
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
const emits = defineEmits({
  resize: null,
});

const startPosition = ref(null);
const left = ref({});
const originWidth = ref(null);
const _animation = ref(props.animation + "ms");
const resizeWidth = ref(null);
const _gap = ref(props.gap + "px");
const box = ref({});
const { x } = useMouse();

watch(
  props,
  ({ visible }) => {
    if (!visible) {
      resizeWidth.value = null;
    }
  },
  {
    deep: true,
    immediate: true,
  },
);

function onMousedown() {
  originWidth.value = left.value.offsetWidth;
  startPosition.value = x.value;
}

function onMousemove() {
  if (startPosition.value) {
    resizeWidth.value = `${originWidth.value - (startPosition.value - x.value)}px`;
    emits("resize", 0);
  }
}

function onMouseup() {
  startPosition.value = null;
  emits("resize", 0);
}
</script>

<template>
  <section
    class="vertical-stretch-box"
    ref="box"
    @mousemove="onMousemove"
    @mouseup="onMouseup">
    <div
      class="left-layout"
      ref="left"
      :class="[{ show: visible }, { animation: !startPosition }]"
      :style="{ width: resizeWidth }">
      <slot name="left"></slot>
    </div>
    <div
      ref="shrink"
      v-if="visible"
      class="shrink-btn"
      @mousedown="onMousedown" />
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
    //min-width: v-bind(_leftWidth);
    height: 100%;
    overflow: hidden;
    @include container();
    &.show {
      width: v-bind(leftWidth);
    }
    &.animation {
      transition: all v-bind(_animation);
    }
  }
  .shrink-btn {
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

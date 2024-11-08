<script>
export default {
  name: "DefaultSlots",
};
</script>

<script setup>
import { validatenull } from "@/utils/validate.js";

defineOptions({
  name: "DefaultSlots",
});

const props = defineProps({
  name: {
    type: String,
    default: null,
  },
  slots: {
    type: Object,
    default: () => {},
  },
});

function isRender() {
  return !validatenull(props.slots[props.name]);
}
</script>

<template>
  <slot v-if="isRender()" :name="name"></slot>
</template>

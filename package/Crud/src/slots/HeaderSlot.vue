<script>
export default {
  name: "HeaderSlot",
};
</script>

<script setup>
import { validatenull } from "@/utils/validate.js";
import { computed } from "vue";

defineOptions({
  name: "HeaderSlot",
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

const SUFFIX = "Header";
const slotName = computed(() => `${props.name}${SUFFIX}`);

function isRender() {
  return !validatenull(props.slots[slotName]);
}
</script>

<template>
  <slot v-if="isRender()" :name="slotName"></slot>
</template>

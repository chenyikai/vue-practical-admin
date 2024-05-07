<script>
export default {
  name: "ShipInfo",
};
</script>

<script setup>
import ComponentBox from "@/pages/Map/ComponentBox.vue";

defineOptions({
  name: "ShipInfo",
});
</script>

<template>
  <component-box class="ship-info-container"></component-box>
</template>

<style scoped lang="scss">
.ship-info-container {
}
</style>

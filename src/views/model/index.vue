<script>
export default {
  name: "ModelPage",
};
</script>

<script setup>
import { onMounted } from "vue";
import { Mapbox } from "plugins/composition/Map/mapbox.js";

defineOptions({
  name: "ModelPage",
});

onMounted(() => {
  Mapbox;
});
</script>

<template>
  <section class="model-page-container">
    <div id="modelMap"></div>
  </section>
</template>

<style scoped lang="scss">
@import "src/styles/variables";
.model-page-container {
  width: 100%;
  height: 100%;
  @include container();
}
</style>

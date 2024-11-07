<script>
export default {
  name: "ModelPage",
};
</script>

<script setup>
import { onMounted } from "vue";
import { init } from "visualization";

defineOptions({
  name: "ModelPage",
});

onMounted(() => {
  init(
    {
      container: "modelMap",
      accessToken:
        "pk.eyJ1IjoiY2hlbnlpa2FpIiwiYSI6ImNrbTZiOTB1dzBtczMydnFzM2V5ZnR0YmcifQ.BPfABgNBi7FIcJBH3BeTwg",
      antialias: true,
      center: [122.21162604088397, 29.995962378718033],
      zoom: 13,
      maxZoom: 17,
    },
    (map) => {},
  );
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
  #modelMap {
    width: 100%;
    height: 100%;
  }
}
</style>

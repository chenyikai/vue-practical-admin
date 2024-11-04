<script setup>
defineOptions({
  name: "IndexPage",
});
</script>

<template>
  <div class="box">
    <div id="3DMap"></div>
  </div>
</template>

<style lang="scss" scoped>
@import "src/styles/variables.scss";
.box {
  width: 100%;
  height: 100%;
  @include container();
}
</style>

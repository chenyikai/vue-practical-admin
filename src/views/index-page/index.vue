<script>
export default {
  name: "IndexPage",
};
</script>

<script setup></script>

<template>
  <div class="index-page-container">首页</div>
</template>

<style lang="scss" scoped>
@import "src/styles/variables";
.index-page-container {
  width: 100%;
  height: 100%;
  @include container();
}
</style>

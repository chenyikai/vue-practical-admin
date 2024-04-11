<script>
export default {
  name: "ShowPage",
};
</script>

<script setup>
defineOptions({
  name: "ShowPage",
});
</script>

<template>
  <section class="show-page-container">
    <upload-file type="pictureCard" />
    <pic-zoom
      class="img"
      src="https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg" />
  </section>
</template>

<style scoped lang="scss">
.show-page-container {
  width: 100%;
  height: 100%;
  max-height: 100%;
  overflow: auto;
  .img {
    width: 400px;
    height: 400px;
  }
}
</style>

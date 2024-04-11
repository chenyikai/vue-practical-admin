<script setup>
import PicZoom from "package/PicZoom/src/index.vue";

defineOptions({
  name: "IndexPage",
});
</script>

<template>
  <div>
    <upload-file type="pictureCard" />
    <pic-zoom
      class="img"
      src="https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg" />
  </div>
</template>

<style>
.img {
  width: 400px;
  height: 400px;
}
</style>

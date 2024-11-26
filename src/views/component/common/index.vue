<script>
export default {
  name: "UploadPage",
};
</script>

<script setup>
import { ref } from "vue";
import IconBox from "package/IconBox/src/index.vue";
import SignBoard from "package/SignBoard/src/index.vue";

defineOptions({
  name: "UploadPage",
});

const icon = ref("");
</script>

<template>
  <section class="common-page-container">
    <admin-card title="图标选择器" class="upload-card" style="height: 100px">
      <icon-box v-model="icon" style="width: 240px; margin-right: 10px" />
      <span class="bind-value">绑定值：{{ icon }}</span>
    </admin-card>

    <admin-card title="签名板" class="upload-card">
      <sign-board />
    </admin-card>
  </section>
</template>

<style lang="scss" scoped>
.common-page-container {
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>

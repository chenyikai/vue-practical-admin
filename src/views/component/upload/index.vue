<script>
export default {
  name: "UploadPage",
};
</script>

<script setup>
defineOptions({
  name: "UploadPage",
});
</script>

<template>
  <section class="upload-page-container">
    <admin-card title="拖动上传组件" class="upload-card">
      <upload-file type="drag" />
    </admin-card>

    <admin-card title="照片墙" class="upload-card">
      <upload-file type="pictureCard" />
    </admin-card>

    <admin-card title="头像上传" class="upload-card">
      <upload-file type="avatar" />
    </admin-card>
  </section>
</template>

<style scoped lang="scss">
.upload-page-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  .upload-card {
    width: 49%;
  }
}
</style>

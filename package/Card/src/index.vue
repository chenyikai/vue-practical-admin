<script>
export default {
  name: "AdminCard",
};
</script>

<script setup>
defineOptions({
  name: "AdminCard",
});

const props = defineProps({
  title: {
    type: String,
    default: null,
  },
});
</script>

<template>
  <section class="admin-card-container">
    <h1 class="title">{{ props.title }}</h1>
    <el-divider class="divider-line" />
    <slot></slot>
  </section>
</template>

<style scoped lang="scss">
.admin-card-container {
  @import "src/styles/variables";
  width: 100%;
  @include container();
  .title {
    font-size: 16px;
    margin: 0;
  }
  & + & {
    margin-top: 20px;
  }
}
</style>

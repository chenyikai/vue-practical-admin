<script>
export default {
  name: "AdminCard",
};
</script>

<script setup>
import { validatenull } from "@/utils/validate";

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
    <template v-if="!validatenull(title)">
      <h1 class="title">{{ props.title }}</h1>
      <el-divider class="divider-line" />
    </template>
    <slot />
  </section>
</template>

<style scoped lang="scss">
.admin-card-container {
  width: 100%;
  @include container();
  .title {
    font-size: 16px;
    margin: 0;
  }
  .divider-line {
    margin: 10px 0;
  }
}
</style>

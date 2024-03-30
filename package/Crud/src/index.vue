<script>
export default {
  name: "PageCrud",
};
</script>

<script setup>
defineOptions({
  name: "PageCrud",
});
defineProps({
  config: {
    type: Object,
    required: true,
    default: () => {},
  },
});
</script>

<template>
  <section class="crud-container"></section>
</template>

<style scoped lang="scss"></style>

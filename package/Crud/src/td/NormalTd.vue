<script>
export default {
  name: "NormalTd",
};
</script>

<script setup>
defineOptions({
  name: "NormalTd",
});

const { column, scope } = defineProps({
  column: {
    type: Object,
    default: () => {},
  },
  scope: {
    type: Object,
    default: () => {},
  },
});

function getValue() {
  const { prop } = column;

  return scope.row[prop];
}
</script>

<template>
  <div class="normal-td-box">{{ getValue() }}</div>
</template>

<style scoped lang="scss"></style>

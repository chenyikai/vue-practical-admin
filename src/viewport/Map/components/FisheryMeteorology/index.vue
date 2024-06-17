<script setup>
import { watch } from "vue";
import { mapStore } from "@/store/index.js";

defineOptions({
  name: "FisheryMeteorology",
});

const MapStore = mapStore();

function open() {}

watch(
  () => MapStore.$state.qxType,
  (news) => {
    open(news);
  },
);
</script>

<template>
  <div></div>
</template>

<style scoped lang="scss"></style>

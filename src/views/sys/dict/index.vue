<script>
export default {
  name: "DictPage",
};
</script>

<script setup>
import { ref, useTemplateRef } from "vue";
import VerticalStretchBox from "package/VerticalStretchBox/src/index.vue";
import DictTree from "./DictTree.vue";
import SubDictPage from "@/views/sys/dict/SubDict/index.vue";

const visible = ref(true);

const subRef = useTemplateRef("sub");

function onNodeClick(data) {
  subRef.value.search(data);
}
</script>

<template>
  <vertical-stretch-box left-width="300px" :visible="visible">
    <template #left>
      <dict-tree @node-click="onNodeClick" />
    </template>
    <template #right>
      <sub-dict-page ref="sub" />
    </template>
  </vertical-stretch-box>
</template>

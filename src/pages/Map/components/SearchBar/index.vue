<script>
export default {
  name: "SearchBar",
};
</script>

<script setup>
import { ref, nextTick } from "vue";
import { debounce } from "lodash";
import ComponentBox from "@/pages/Map/ComponentBox.vue";
import SearchInput from "./SearchInput.vue";
import ResultList from "./ResultList.vue";
import { validatenull } from "@/utils/validate.js";

defineOptions({
  name: "SearchBar",
});

const keyword = ref("");
const isSearch = ref(false);
const list = ref({});

const onSearch = debounce(
  function () {
    isSearch.value = !validatenull(keyword.value);
    nextTick().then(() => {
      isSearch.value && list.value.search(keyword.value);
    });
  },
  300,
  {
    leading: false,
    trailing: true,
  },
);

function onNodeClick(node) {
  isSearch.value = false;
  console.log(node, "node");
}
</script>

<template>
  <component-box class="search-bar-control">
    <search-input v-model="keyword" @search="onSearch" />
  </component-box>
  <result-list v-if="isSearch" ref="list" @node-click="onNodeClick" />
</template>

<style scoped lang="scss">
.search-bar-control {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 340px;
  height: 47px;
}
</style>

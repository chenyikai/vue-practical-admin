<script>
export default {
  name: "SearchBar",
};
</script>

<script setup>
import { ref, nextTick } from "vue";
import { debounce } from "lodash";
import ComponentBox from "../../ComponentBox.vue";
import SearchInput from "./SearchInput.vue";
import ResultList from "./ResultList.vue";
import { validatenull } from "@/utils/validate.js";
import { searchStore, shipInfoStore } from "@/store";
const SearchStore = searchStore();
const ShipInfoStore = shipInfoStore();

defineOptions({
  name: "SearchBar",
});

const keyword = ref("");
const list = ref({});

const onSearch = debounce(
  function () {
    if (validatenull(keyword.value)) {
      SearchStore.hide();
    } else {
      SearchStore.show();
      nextTick().then(() => {
        list.value.search(keyword.value);
      });
    }
  },
  300,
  {
    leading: false,
    trailing: true,
  },
);

function onNodeClick(node) {
  SearchStore.hide();
  ShipInfoStore.show(node.mmsi);
}
</script>

<template>
  <component-box class="search-bar-control">
    <search-input v-model="keyword" @search="onSearch" />
  </component-box>
  <result-list
    v-if="SearchStore.visible"
    ref="list"
    @node-click="onNodeClick" />
</template>

<style lang="scss">
.search-bar-control {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 340px;
  height: 47px;
}
</style>

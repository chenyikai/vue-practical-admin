<script>
export default {
  name: "ResultList",
};
</script>

<script setup>
import { ref, onUnmounted } from "vue";
import ComponentBox from "../../ComponentBox.vue";
import { searchStore } from "@/store";
const SearchStore = searchStore();

defineOptions({
  name: "ResultList",
});

const emits = defineEmits(["node-click"]);

const baseHeight = ref("500px");

function getList(keyword) {
  SearchStore.search(keyword);
}

function onClick(val) {
  emits("node-click", val);
}

onUnmounted(() => {
  SearchStore.hide();
});

defineExpose({
  search: getList,
});
</script>

<template>
  <component-box
    class="search-result-list"
    :loading="SearchStore.loading"
    :zIndex="SearchStore.zIndex">
    <template v-if="!SearchStore.isEmpty">
      <ul class="result-list" :class="{ empty: SearchStore.isEmpty }">
        <li
          class="result"
          v-for="item in SearchStore.results"
          :key="item.mmsi"
          @click.stop="onClick(item)">
          <span class="label">{{
            `船名：${item.cnname || item.enname || item.mmsi}`
          }}</span>
          <span class="mmsi">{{ `MMSI：${item.mmsi}` }}</span>
        </li>
      </ul>
    </template>
    <el-empty v-else description="暂无结果" />
  </component-box>
</template>

<style scoped lang="scss">
.search-result-list {
  position: absolute;
  top: 65px;
  right: 12px;
  width: 340px;
  .result-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-height: v-bind(baseHeight);
    overflow: auto;
    padding: 5px;
    font-size: 14px;
    &.empty {
      height: v-bind(baseHeight);
    }
    .result {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 30px;
      flex-shrink: 0;
      padding: 0 5px;
      cursor: pointer;
      &:hover {
        background-color: rgba($color: #ffffff, $alpha: 0.2);
      }
    }
  }
}
</style>

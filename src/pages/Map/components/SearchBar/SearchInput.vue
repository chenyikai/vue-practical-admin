<script>
export default {
  name: "SearchInput",
};
</script>

<script setup>
defineOptions({
  name: "SearchInput",
});
const emits = defineEmits(["search"]);

const keyword = defineModel({ type: String });

function onInput(val) {
  keyword.value = val;
  onSearch();
}

function onSearch() {
  emits("search", keyword);
}
</script>

<template>
  <el-input
    class="search-input"
    :model-value="keyword"
    placeholder="查找指定经纬度、船舶、港口码头等"
    @input="onInput">
    <template v-slot:suffix>
      <button class="search-button" @click="onSearch">
        <img
          src="@/assets/images/searchBar/search-btn.png"
          alt=""
          class="search-btn" />
      </button>
    </template>
  </el-input>
</template>

<style lang="scss">
.search-input {
  width: 100%;
  height: 100%;
  .el-input__wrapper {
    height: 100%;
    background-color: transparent;
    box-shadow: none;
    padding-right: 5px;
    .el-input__inner {
      height: 100%;
      font-size: 12px;
    }
  }

  .search-button {
    position: relative;
    top: 2px;
    background-color: transparent;
    border: none;
    .icon {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      font-size: 16px;
      font-weight: bold;
    }
    img {
      width: 30px;
      height: 30px;
    }
  }
}
</style>

<script>
import { throttle } from "lodash";

export default {
  name: "SearchInput",
  props: {
    value: {
      type: String,
      default: undefined,
    },
  },
  model: {
    prop: "value",
    event: "input",
  },
  methods: {
    handleInput: throttle(function (val) {
      this.$emit("input", val);
      this.$emit("search", this.value);
    }, 150),
    handleSearch() {
      this.$emit("search", this.value);
    },
  },
};
</script>

<template>
  <div class="search-input-container">
    <el-input
      class="keyword-input"
      prefix-icon="el-icon-search"
      :value="value"
      placeholder="请输入船舶"
      @input="handleInput">
      <el-button
        type="primary"
        icon="el-icon-search"
        slot="append"
        @click="handleSearch" />
    </el-input>
  </div>
</template>

<style lang="scss">
.search-input-container {
  width: 100%;
  height: 40px;
  background-color: #fff;
  box-shadow: 0px 0px 4px 0px rgba(1, 24, 68, 0.19);
  border-radius: 4px;
  .keyword-input {
    .el-input__inner {
      height: 40px;
      line-height: 40px;
      border: none;
    }
    .el-input__icon {
      line-height: 40px;
      font-size: 18px;
    }
    .el-input-group__append {
      border: none;
      background-color: #409eff;
      color: #fff;
      font-size: 16px;
      padding: 0 15px;
    }
  }
}
</style>

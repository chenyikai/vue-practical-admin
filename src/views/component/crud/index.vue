<script>
export default {
  name: "CrudCard",
};
</script>

<script setup>
import { useId } from "vue";
import PageCrud from "package/Crud/src/index.vue";
import AdminCard from "package/Card/src/index.vue";
import PageButton from "package/Button/src/index.vue";

defineOptions({
  name: "CrudCard",
});

const config = {
  type: "index", // 'default' | 'selection' | 'index' | 'expand'
  height: "100%",
  columns: [
    {
      label: "普通",
      prop: "normal",
    },
    {
      label: "图片",
      prop: "image",
      type: "image",
    },
    {
      label: "评价",
      prop: "rate",
      type: "rate",
      config: {
        // disabled: true,
        onChange: (val) => {
          console.log(val, "val");
        },
      },
    },
    {
      label: "标签",
      prop: "tag",
      type: "tag",
      config: (row) => {
        return {
          type: row.tag === "已上架" ? "success" : "info",
        };
      },
    },
    {
      label: "文本",
      prop: "text",
      type: "text",
      config: {
        truncated: true,
        tooltip: {
          placement: "top",
        },
      },
    },
    {
      label: "操作",
      prop: "menu",
    },
  ],
};

const tableData = [
  {
    id: useId(),
    normal: `普通单元格${useId()}`,
    image: "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
    rate: Math.random() * 5,
    tag: "已上架",
    text: "这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！",
  },
  {
    id: useId(),
    normal: `普通单元格${useId()}`,
    image: "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
    rate: Math.random() * 5,
    tag: "已上架",
    editabled: true,
    text: "这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！",
  },
  {
    id: useId(),
    normal: `普通单元格${useId()}`,
    image: "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
    rate: Math.random() * 5,
    tag: "已上架",
    text: "这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！这是一段文本！",
  },
];

function onTest(scope) {
  console.log(scope, "onTest1");
}
</script>

<template>
  <admin-card class="crud-card-container">
    <div class="button-group">
      <page-button type="search" />
    </div>
    <div class="box">
      <page-crud
        v-model="tableData"
        :data="tableData"
        :config="config"
        row-key="id"
        border
        default-expand-all>
        <template #menu="{ scope }">
          <page-button type="create" direction="horizontal" @click.stop="onTest(scope)" />
          <page-button type="detail" direction="horizontal" @click.stop="onTest(scope)" />
          <page-button type="update" direction="horizontal" @click.stop="onTest(scope)" />
          <page-button type="delete" direction="horizontal" @click.stop="onTest(scope)" />
        </template>
      </page-crud>
    </div>
  </admin-card>
</template>

<style scoped lang="scss">
.crud-card-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .button-group {
    width: 100%;
    height: 70px;
  }
  .box {
    width: 100%;
    flex: 1;
    overflow: hidden;
  }
}
</style>

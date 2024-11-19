<script>
export default {
  name: "CrudCard",
};
</script>

<script setup>
import PageCrud from "package/Crud/src/index.vue";
import AdminCard from "package/Card/src/index.vue";

defineOptions({
  name: "CrudCard",
});

const config = {
  // type: "expand", // 'default' | 'selection' | 'index' | 'expand'
  height: "100%",
  columns: [
    {
      label: "部门机构名称",
      prop: "deptName",
    },
    {
      label: "部门机构全称",
      prop: "fullName",
    },
    {
      label: "排序",
      prop: "sort",
    },
    {
      label: "备注",
      prop: "remark",
      overHidden: true,
    },
    {
      label: "操作",
      prop: "menu",
      slot: true,
    },
  ],
};

const tableData = [
  {
    id: 1,
    deptName: "部门机构名称",
    fullName: "部门机构全称",
    sort: "排序",
    remark: "备注",
  },
];
</script>

<template>
  <admin-card class="crud-card-container">
    <page-crud
      :data="tableData"
      :config="config"
      row-key="id"
      border
      default-expand-all>
    </page-crud>
  </admin-card>
</template>

<style scoped lang="scss">
.crud-card-container {
  width: 100%;
  height: 100%;
}
</style>

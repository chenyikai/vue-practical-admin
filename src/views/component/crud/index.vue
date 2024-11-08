<script>
export default {
  name: "CrudCard",
};
</script>

<script setup>
import PageCrud from "package/Crud/src/index.vue";

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
      align: "center",
      children: [
        {
          label: "部门机构全称1",
          prop: "fullName1",
        },
        {
          label: "部门机构全称2",
          prop: "fullName2",
          children: [
            {
              label: "部门机构全称3",
              prop: "fullName3",
            },
            {
              label: "部门机构全称4",
              prop: "fullName4",
            },
          ],
        },
      ],
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
    deptName: "部门机构名称",
    fullName: "部门机构全称",
    fullName1: "部门机构全称1",
    fullName2: "部门机构全称2",
    fullName3: "部门机构全称3",
    fullName4: "部门机构全称4",
    sort: "排序",
    remark: "备注",
  },
];
</script>

<template>
  <section class="crud-card-container">
    <page-crud :data="tableData" :config="config">
      <template #fullName2>
        {{ "deptName" }}
      </template>
    </page-crud>
  </section>
</template>

<style scoped lang="scss">
.crud-card-container {
  width: 100%;
  height: 100%;
}
</style>

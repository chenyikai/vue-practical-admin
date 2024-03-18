<script>
export default {
  name: "DictPage",
};
</script>

<script setup>
import useCrud from "@/hooks/useCrud.js";
import { crudOption } from "./options.js";
import MainDialog from "./MainDialog.vue";

const {
  dialog,
  listQuery,
  pagination,
  mainTableData,
  tableLoading,
  sizeChange,
  handleFilter,
  currentChange,
  sortChange,
  handelResetSearchForm,
} = useCrud();

function handleAdd() {
  dialog.value.open();
}
</script>

<template>
  <page-container class="dict-page-container">
    <template #search>
      <el-form
        ref="searchForm"
        :model="listQuery"
        :inline="true"
        label-suffix=":"
        @submit.prevent="handleFilter">
        <el-form-item label="英文名称" prop="type">
          <el-input
            v-model="listQuery.type"
            placeholder="请输入英文名称"></el-input>
        </el-form-item>
        <el-form-item label="中文描述" prop="remarks">
          <el-input
            v-model="listQuery.remarks"
            placeholder="请输入中文描述"></el-input>
        </el-form-item>
        <el-form-item>
          <page-button type="search" />
          <page-button type="reset" @click.prevent="handelResetSearchForm" />
        </el-form-item>
      </el-form>
    </template>
    <template #button>
      <page-button type="create" @click.stop="handleAdd" />
    </template>
    <template #crud>
      <avue-crud
        ref="crud"
        :page="pagination"
        :option="crudOption"
        :data="mainTableData"
        :table-loading="tableLoading"
        @size-change="sizeChange"
        @current-change="currentChange"
        @sort-change="sortChange">
        <template v-slot:menu>
          <page-button type="export" direction="horizontal" />
          <page-button type="download" direction="horizontal" />
          <page-button type="pic" direction="horizontal" />
          <page-button type="detail" direction="horizontal" />
          <page-button type="update" direction="horizontal" />
          <page-button type="delete" direction="horizontal" />
        </template>
      </avue-crud>
    </template>
    <template #dialog>
      <main-dialog ref="dialog" />
    </template>
  </page-container>
</template>

<script>
export default {
  name: "DictPage",
};
</script>

<script setup>
import { onBeforeMount, ref } from "vue";
import { getDictPage } from "@/api/sys/dict";
import useCrud from "@/hooks/useCrud.js";
import { crudOption } from "./options.js";
import MainDialog from "./MainDialog.vue";

const {
  dialog,
  funcList,
  listQuery,
  pagination,
  mainTableData,
  tableLoading,
  getList,
  sizeChange,
  handleFilter,
  currentChange,
  sortChange,
  handelResetSearchForm,
} = useCrud();

const dictEntry = ref(new URL("/entry.svg", import.meta.url).href);

function onAdd() {
  dialog.value.open();
}

function onDelete() {}

function onUpdate() {}

function onSearch() {
  handleFilter();
}

onBeforeMount(() => {
  funcList.search = getDictPage;
  getList();
});
</script>

<template>
  <page-container class="dict-page-container">
    <template #search>
      <el-form
        ref="searchForm"
        :model="listQuery"
        :inline="true"
        label-suffix=":">
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
          <page-button type="search" @click.stop="onSearch" />
          <page-button type="reset" @click.prevent="handelResetSearchForm" />
        </el-form-item>
      </el-form>
    </template>
    <template #button>
      <page-button type="create" @click.stop="onAdd" />
      <!--      <page-button-->
      <!--        :icon="dictEntry"-->
      <!--        label="字典项管理"-->
      <!--        direction="horizontal" />-->
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
          <page-button type="detail" direction="horizontal" />
          <page-button
            type="update"
            direction="horizontal"
            @click.stop="onUpdate" />
          <page-button
            type="delete"
            direction="horizontal"
            @click.stop="onDelete" />
        </template>
      </avue-crud>
    </template>
    <template #dialog>
      <main-dialog ref="dialog" />
    </template>
  </page-container>
</template>

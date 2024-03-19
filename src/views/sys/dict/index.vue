<script>
export default {
  name: "DictPage",
};
</script>

<script setup>
import website from "@/config/website.js";
import { ElMessage, ElMessageBox } from "element-plus";
import { onBeforeMount, ref } from "vue";
import {
  getDictPage,
  createDict,
  deleteDictById,
  updateDict,
} from "@/api/sys/dict";
import useCrud from "@/hooks/useCrud.js";
import { crudOption } from "./options.js";
import MainDialog from "./MainDialog.vue";
import DictEntryDialog from "@/views/sys/dict/DictEntryDialog.vue";

const {
  dialog,
  funcList,
  listQuery,
  pagination,
  mainTableData,
  tableLoading,
  getList,
  sortChange,
  sizeChange,
  handleFilter,
  currentChange,
  handelResetSearchForm,
} = useCrud();

const dictEntry = new URL("/entry.svg", import.meta.url);
const dictDialog = ref({});

function onAdd() {
  dialog.value.open(website.pageStatus.CREATE);
}

function onDelete(rowData) {
  ElMessageBox.confirm(`是否确认删除字典：${rowData.remarks}？`, "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      return deleteDictById(rowData.id);
    })
    .then(() => {
      ElMessage({
        message: "删除成功!",
        type: "success",
      });
      handleFilter();
    });
}

function onUpdate(rowData) {
  dialog.value.open(website.pageStatus.UPDATE, rowData);
}

function onDetail(rowData) {
  dialog.value.open(website.pageStatus.DETAIL, rowData);
}

function onCreateSubmit(formData, done) {
  createDict(formData)
    .then(() => {
      done(true);
      ElMessage({
        message: "新增成功",
        type: "success",
      });
      getList();
    })
    .catch(() => {
      ElMessage({
        message: "新增失败",
        type: "error",
      });
      done();
    });
}

function onUpdateSubmit(formData, done) {
  updateDict(formData)
    .then(() => {
      done(true);
      ElMessage({
        message: "修改成功",
        type: "success",
      });
      getList();
    })
    .catch(() => {
      ElMessage({
        message: "修改失败",
        type: "error",
      });
      done();
    });
}

function handleDictEntry(rowData) {
  dictDialog.value.open(rowData);
}

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
        <template v-slot:menu="{ row }">
          <page-button
            :icon="dictEntry"
            label="字典项"
            direction="horizontal"
            @click.stop="handleDictEntry(row)" />
          <page-button
            type="detail"
            direction="horizontal"
            @click.stop="onDetail(row)" />
          <page-button
            type="update"
            direction="horizontal"
            @click.stop="onUpdate(row)" />
          <page-button
            type="delete"
            direction="horizontal"
            @click.stop="onDelete(row)" />
        </template>
      </avue-crud>
    </template>
    <template #dialog>
      <main-dialog
        ref="dialog"
        @[website.pageStatus.CREATE]="onCreateSubmit"
        @[website.pageStatus.UPDATE]="onUpdateSubmit" />
      <dict-entry-dialog ref="dictDialog" />
    </template>
  </page-container>
</template>

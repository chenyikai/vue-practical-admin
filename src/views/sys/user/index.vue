<script>
export default {
  name: "UserPage",
};
</script>

<script setup>
import website from "@/config/website.js";
import { ElMessage, ElMessageBox } from "element-plus";
import { onBeforeMount } from "vue";
import useCrud from "@/hooks/useCrud.js";
import { crudOption } from "./options.js";
import MainDialog from "./MainDialog.vue";
import { useClipboard } from "@vueuse/core";
import {
  createUser,
  deleteUserById,
  getUserPage,
  resetPwd,
  updateUser,
} from "@/api/sys/user/index.js";

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

const resetPassword = new URL("/reset-password.svg", import.meta.url);

function onAdd() {
  dialog.value.open(website.pageStatus.CREATE);
}

function onDelete(rowData) {
  ElMessageBox.confirm(`是否确认删除用户：${rowData.username}？`, "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      return deleteUserById(rowData.id);
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
  createUser(formData)
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
  updateUser(formData)
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

function handleReset(rowData) {
  ElMessageBox.confirm(`是否确认重置用户：${rowData.username}密码？`, "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      return resetPwd({ id: rowData.id });
    })
    .then(({ data }) => {
      ElMessageBox.alert(data.data, "您的密码重置为", {
        confirmButtonText: "复制",
        cancelButtonText: "取消",
        callback: (action) => {
          if (action !== "confirm") return;

          const { copy, isSupported } = useClipboard();
          if (!isSupported) {
            ElMessage({
              message: "重置失败，您的浏览器不支持Clipboard API",
              type: "error",
            });
            return;
          }

          copy(data.data);

          ElMessage({
            message: "重置成功，已复制到剪贴板",
            type: "success",
          });
        },
      });
    });
}

function onSearch() {
  handleFilter();
}

onBeforeMount(() => {
  funcList.page = getUserPage;
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
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="listQuery.username"
            placeholder="请输入用户名"
            clearable></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input
            v-model="listQuery.name"
            placeholder="请输入姓名"
            clearable></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="mobile">
          <el-input
            v-model="listQuery.mobile"
            placeholder="请输入联系方式"
            clearable></el-input>
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
            :icon="resetPassword"
            label="重置密码"
            direction="horizontal"
            @click.stop="handleReset(row)" />
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
    </template>
  </page-container>
</template>

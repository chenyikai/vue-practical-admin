<script>
export default {
  name: "RoleListCard",
};
</script>

<script setup>
import website from "@/config/website.js";
import { ElMessage, ElMessageBox } from "element-plus";
import { onBeforeMount } from "vue";
import useCrud from "@/hooks/useCrud.js";
import { crudOption } from "./options.js";
import MainDialog from "./MainDialog.vue";
import {
  createRole,
  deleteRoleById,
  getRoleList,
  updateRole,
} from "@/api/sys/role/index.js";
import { validatenull } from "@/utils/validate.js";
const {
  crud,
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
const emits = defineEmits({ setting: null });

const settingIcon = new URL("/setting.svg", import.meta.url);
const pageInfo = {
  icon: "/role.svg",
  label: "角色管理",
};

function onAdd() {
  dialog.value.open(website.pageStatus.CREATE);
}

function onDelete(rowData) {
  ElMessageBox.confirm(`是否确认删除角色：${rowData.roleName}？`, "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      return deleteRoleById(rowData.id);
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

function resetTable() {
  crud.value.getTableHeight();
}

function onSetting(rowData) {
  emits("setting", rowData);
}

function onCreateSubmit(formData, done) {
  createRole(formData)
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
  updateRole(formData)
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

function getRoleData() {
  return new Promise((resolve, reject) => {
    getRoleList()
      .then(({ data }) => {
        let mainData = validatenull(listQuery.roleName)
          ? data.data
          : data.data.filter(
              (item) => item.roleName.indexOf(listQuery.roleName) !== -1,
            );
        resolve({
          mainData,
        });
      })
      .catch((e) => reject(e));
  });
}

function onSearch() {
  handleFilter();
}

onBeforeMount(() => {
  funcList.callback = getRoleData;
  getList();
});

defineExpose({
  resetTable,
});
</script>

<template>
  <page-container class="role-list-page-container" :page-info="pageInfo">
    <template #search>
      <el-form
        ref="searchForm"
        :model="listQuery"
        :inline="true"
        label-suffix=":">
        <el-form-item label="角色名" prop="roleName">
          <el-input
            v-model="listQuery.roleName"
            placeholder="请输入用户名"
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
            :icon="settingIcon"
            label="权限配置"
            direction="horizontal"
            @click.stop="onSetting(row)" />
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

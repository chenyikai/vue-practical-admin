<script>
export default {
    name: "apiManage",
};
</script>

<script setup>
import website from "@/config/website.js";
import { onBeforeMount } from "vue";
import useCrud from "@/hooks/useCrud.js";
import { crudOption } from "./options.js";
import MainDialog from "./MainDialog.vue";
import { getApiPage, updateApi, createApi, deleteApi } from "./api.js";
import { ElMessage, ElMessageBox } from "element-plus";

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

function onDetail(rowData) {
    dialog.value.open(website.pageStatus.DETAIL, rowData);
}
function onSearch() {
    handleFilter();
}
function onAdd() {
    dialog.value.open(website.pageStatus.CREATE);
}
function onCreateSubmit(formData, done) {
    createApi(formData)
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
function onUpdate(rowData) {
    dialog.value.open(website.pageStatus.UPDATE, rowData);
}
function onUpdateSubmit(formData, done) {
    updateApi(formData)
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
function onDelete(rowData) {
    ElMessageBox.confirm(`是否确认api接口：${rowData.name}？`, "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
    })
        .then(() => {
            return deleteApi(rowData.id);
        })
        .then(() => {
            ElMessage({
                message: "删除成功!",
                type: "success",
            });
            handleFilter();
        });
}
onBeforeMount(() => {
    funcList.page = getApiPage;
    getList();
});
</script>

<template>
    <page-container class="dict-page-container">
        <!-- 搜索 -->
        <template #search>
            <el-form
                ref="searchForm"
                :model="listQuery"
                :inline="true"
                label-suffix=":"
            >
                <el-form-item label="接口名称" prop="name">
                    <el-input
                        v-model="listQuery.name"
                        placeholder="请输入接口名称"
                    ></el-input>
                </el-form-item>

                <el-form-item>
                    <page-button type="search" @click.stop="onSearch" />
                    <page-button
                        type="reset"
                        @click.prevent="handelResetSearchForm"
                    />
                </el-form-item>
            </el-form>
        </template>
        <!-- 按钮 -->
        <template #button>
            <page-button type="create" @click.stop="onAdd" />
        </template>
        <!-- 表格 -->
        <template #crud>
            <avue-crud
                ref="crud"
                :page="pagination"
                :option="crudOption"
                :data="mainTableData"
                :table-loading="tableLoading"
                @size-change="sizeChange"
                @current-change="currentChange"
                @sort-change="sortChange"
            >
                <template v-slot:menu="{ row }">
                    <page-button
                        type="detail"
                        direction="horizontal"
                        @click.stop="onDetail(row)"
                    />
                    <page-button
                        type="update"
                        direction="horizontal"
                        @click.stop="onUpdate(row)"
                    />
                    <page-button
                        type="delete"
                        direction="horizontal"
                        @click.stop="onDelete(row)"
                    />
                </template>
            </avue-crud>
        </template>
        <!-- 弹窗 -->
        <template #dialog>
            <MainDialog
                ref="dialog"
                @[website.pageStatus.CREATE]="onCreateSubmit"
                @[website.pageStatus.UPDATE]="onUpdateSubmit"
            />
        </template>
    </page-container>
</template>

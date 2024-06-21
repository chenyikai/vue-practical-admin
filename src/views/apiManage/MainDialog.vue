<script>
export default {
    name: "MainDialog",
};
</script>

<script setup>
import useForm from "@/hooks/useForm.js";
import { nextTick } from "vue";
import { formOption } from "./options.js";
import { apiDetail } from "./api.js";
import website from "@/config/website.js";
import { getDictData } from "@/utils/util";
import { validatenull } from "@/utils/validate.js";
import { ElMessage } from "element-plus";

// 申明自定义事件
const emits = defineEmits({
    [website.pageStatus.CREATE]: null,
    [website.pageStatus.UPDATE]: null,
    [website.pageStatus.DETAIL]: null,
});
// 引入hooks变量和方法
const {
    key,
    form,
    loading,
    dialog,
    formData,
    formStatus,
    isDetail,
    detailFunc,
    setData,
} = useForm();
// data不传值 默认空对象
function open(status, data = {}) {
    // 详情的回调函数
    detailFunc.value = apiDetail;
    // 创建数据
    setData(status, data).then(() => {
        if (
            status.value !== "create" &&
            formData.value &&
            formData.value.paramInfo
        ) {
            formData.value.paramInfo = JSON.parse(formData.value.paramInfo);
        } else {
            formData.value.paramInfo = [
                {
                    keyName: "",
                    isMust: "",
                    dataType: "",
                    remark: " ",
                },
            ];
        }
    });
    formOption.disabled = isDetail.value;
    dialog.value.open();
    nextTick().then(() => {
        form.value.clearValidate();
    });
}

function onDialogSubmit() {
    form.value.submit();
}
function onFormSubmit(data, done) {
    // if (formData.value.paramInfo.length) {
    //     let arr = formData.value.paramInfo.find((element) => {
    //         return !element.keyName;
    //     });
    //     if (arr) {
    //         return ElMessage({
    //             message: "请补充列表的参数名称",
    //             type: "error",
    //         });
    //     }
    // }
    dialog.value.onLoad();
    emits(formStatus.value, formData.value, (isClose = false) => {
        done();
        dialog.value.onDone(isClose);
    });
}
// close 执行的回调
function handleClose() {}
// 暴露函数
defineExpose({
    open,
});

const apiDataType = getDictData("api_data_type", "string");
const yes_or_no = getDictData("yes_no", "number");

// 删除行
const deleteRow = (index) => {
    formData.value.paramInfo.splice(index, 1);
};
// 新增行
const onAddItem = () => {
    formData.value.paramInfo.push({
        keyName: "",
        isMust: "",
        dataType: "",
        remark: "",
    });
};
</script>

<template>
    <page-dialog
        title="api管理"
        ref="dialog"
        :loading="loading"
        :show-footer="!isDetail"
        @submit="onDialogSubmit"
        @close="handleClose"
    >
        <avue-form
            ref="form"
            :key="key"
            :option="formOption"
            v-model="formData"
            @submit="onFormSubmit"
        />

        <el-table :data="formData.paramInfo" max-height="550">
            <el-table-column
                prop="keyName"
                label="参数名称"
                align="center"
                width="120"
            >
                <template #default="scope">
                    <el-input
                        v-model="formData.paramInfo[scope.$index].keyName"
                        :disabled="isDetail"
                    ></el-input>
                </template>
            </el-table-column>
            <el-table-column
                prop="isMust"
                label="是否必填"
                width="120"
                align="center"
            >
                <template #default="scope">
                    <el-select
                        :disabled="isDetail"
                        v-model="formData.paramInfo[scope.$index].isMust"
                    >
                        <el-option
                            v-for="item in yes_or_no"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </template>
            </el-table-column>

            <el-table-column
                prop="dataType"
                label="数据类型"
                width="120"
                align="center"
            >
                <template #default="scope">
                    <el-select
                        :disabled="isDetail"
                        value-key="number"
                        v-model="formData.paramInfo[scope.$index].dataType"
                    >
                        <el-option
                            v-for="item in apiDataType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="说明" align="center">
                <template #default="scope">
                    <el-input
                        :disabled="isDetail"
                        v-model="formData.paramInfo[scope.$index].remark"
                    ></el-input>
                </template>
            </el-table-column>
            <el-table-column
                fixed="right"
                align="center"
                label="操作"
                width="120"
            >
                <template #default="scope">
                    <el-button
                        link
                        type="primary"
                        size="small"
                        @click.prevent="deleteRow(scope.$index)"
                        :disabled="isDetail"
                    >
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-button
            class="mt-4"
            style="width: 100%"
            @click="onAddItem"
            v-if="!isDetail"
        >
            新增
        </el-button>
    </page-dialog>
</template>

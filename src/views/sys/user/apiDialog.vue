<script>
export default {
    name: "apiDialog",
};
</script>

<script setup>
import useForm from "@/hooks/useForm.js";
import { nextTick, ref } from "vue";
import { apiFormOption } from "./options.js";
import website from "@/config/website.js";
import { getApiPage } from "@/views/apiManage/api.js";
let apiList = ref([]);
getApiPage({ data: {}, params: { pageSize: 99, pageIndex: 1 } }).then(
    ({ data }) => {
        apiList.value = data.data.rows;
    }
);

const emits = defineEmits({
    [website.pageStatus.CREATE]: null,
    [website.pageStatus.UPDATE]: null,
    [website.pageStatus.DETAIL]: null,
});
const {
    key,
    form,
    loading,
    formStatus,
    dialog,
    formData,
    isDetail,
    detailFunc,
    setData,
} = useForm();
function open(status, data = {}) {
    setData(status, data);
    apiFormOption.disabled = isDetail.value;
    dialog.value.open();
    nextTick().then(() => {
        form.value.clearValidate();
    });
}
function onFormSubmit(data, done) {
    dialog.value.onLoad();
    let obj = formData.value;
    delete obj.apiId;
    emits(formStatus.value, obj, (isClose = false) => {
        done();
        dialog.value.onDone(isClose);
    });
}
function onDialogSubmit() {
    form.value.submit();
}
function handleApiChange(val) {
    formData.apiId = val.join(",");
    formData.value.apiList = val.map((item) => {
        let obj = apiList.value.find((i) => i.id == item);
        return {
            apiId: obj.id,
            apiName: obj.name,
        };
    });
}

// 暴漏函数
defineExpose({
    open,
});
</script>

<template>
    <page-dialog
        title="api分配"
        ref="dialog"
        @submit="onDialogSubmit"
        @close="onClose"
        :loading="loading"
        :show-footer="!isDetail"
    >
        <avue-form
            :key="key"
            ref="form"
            :option="apiFormOption"
            v-model="formData"
            @submit="onFormSubmit"
        >
            <template #apiId>
                <el-select
                    v-model="formData.apiId"
                    @change="handleApiChange"
                    multiple
                >
                    <el-option
                        v-for="item in apiList"
                        :label="item.name"
                        :value="item.id"
                        :key="item.id"
                    ></el-option>
                </el-select>
            </template>
        </avue-form>
    </page-dialog>
</template>

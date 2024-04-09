import { computed, ref } from "vue";
import website from "@/config/website.js";
import { validatenull } from "@/utils/validate.js";
import { ElMessage } from "element-plus";

export default () => {
  const key = ref(1);
  const loading = ref(false);
  const detailFunc = ref(null);
  const dialog = ref({});
  const form = ref({});
  const formData = ref({});
  const formStatus = ref(null);
  const isDetail = computed(
    () => formStatus.value === website.pageStatus.DETAIL,
  );

  function setData(status, form) {
    formStatus.value = status;

    return new Promise((resolve, reject) => {
      if (validatenull(form.id)) {
        formData.value = form;
        resolve(formData);
      } else {
        if (validatenull(detailFunc.value)) {
          ElMessage({
            message: "未传入detail方法",
            type: "error",
          });
          return;
        }

        loading.value = true;
        detailFunc
          .value(form.id)
          .then(({ data }) => {
            formData.value = data.data;
            resolve(formData);
          })
          .catch((e) => reject(e))
          .finally(() => {
            loading.value = false;
          });
      }
      forceUpdate();
    });
  }

  function setColumnData(option, prop, key, value) {
    const index = option.column.findIndex((item) => item.prop === prop);
    if (index === -1) {
      console.warn("未找到该配置");
      return;
    }
    option.column[index][key] = value;

    forceUpdate();
  }

  /**
   * 强制更新form组件(需要绑定key)
   */
  function forceUpdate() {
    key.value += 1;
  }

  function setDisabled(option, disabled) {
    option.column.forEach((item) => {
      item["disabled"] = disabled;
    });

    return option;
  }

  return {
    key,
    form,
    dialog,
    loading,
    isDetail,
    formData,
    formStatus,
    detailFunc,
    setData,
    setDisabled,
    setColumnData,
    forceUpdate,
  };
};

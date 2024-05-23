import { computed, ref } from "vue";
import website from "@/config/website.js";
import { validatenull } from "@/utils/validate.js";
import { ElMessage } from "element-plus";

export default () => {
  // 表单key 用于刷新组件
  const key = ref(1);
  // 是否加载数据
  const loading = ref(false);
  // 表单详情方法
  const detailFunc = ref(null);
  // 弹窗实例（需弹窗组件绑定好ref）
  const dialog = ref({});
  // 表单实例（需表单组件绑定好ref）
  const form = ref({});
  // 表单数据
  const formData = ref({});
  // 表单状态 website.pageStatus
  const formStatus = ref(null);
  // 是否详情
  const isDetail = computed(
    () => formStatus.value === website.pageStatus.DETAIL,
  );
  // 是否渲染表单
  const render = ref(false);

  /**
   * 设置数据
   * @param status 表单状态
   * @param form 表单数据
   * @return {Promise<unknown>}
   */
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
            render.value = true;
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

  /**
   * 设置表单配置column数据
   * @param option 表单配置
   * @param prop 表单字段
   * @param key 属性key
   * @param value 数值value
   */
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

  /**
   * 设置表单禁用状态
   * @param option 表单配置
   * @param disabled 是否禁用
   * @return {*}
   */
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
    render,
    setData,
    setDisabled,
    setColumnData,
    forceUpdate,
  };
};

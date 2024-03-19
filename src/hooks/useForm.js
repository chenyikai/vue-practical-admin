import { computed, ref } from "vue";
import website from "@/config/website.js";
import { validatenull } from "@/utils/validate.js";

export default () => {
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
    if (validatenull(form.id)) {
      formData.value = form;
    } else {
      loading.value = true;
      detailFunc
        .value(form.id)
        .then(({ data }) => {
          formData.value = data.data;
        })
        .finally(() => {
          loading.value = false;
        });
    }

    formStatus.value = status;
  }

  return {
    form,
    dialog,
    loading,
    isDetail,
    formData,
    formStatus,
    detailFunc,
    setData,
  };
};

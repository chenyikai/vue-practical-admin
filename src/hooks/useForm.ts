import { computed, ref, type Ref, type ComputedRef } from "vue";
import website from "@/config/website";
import { validatenull } from "@/utils/validate";
import { ElMessage } from "element-plus";

interface ColumnItem {
  prop: string;
  disabled?: boolean;
  [key: string]: unknown;
}

interface FormOption {
  column: ColumnItem[];
  [key: string]: unknown;
}

interface FormRecord {
  id?: string | number;
  [key: string]: unknown;
}

interface DetailResponse {
  data: {
    data: FormRecord;
  };
}

interface UseFormReturn {
  key: Ref<number>;
  form: Ref<FormRecord>;
  dialog: Ref<Record<string, unknown>>;
  loading: Ref<boolean>;
  isDetail: ComputedRef<boolean>;
  formData: Ref<FormRecord>;
  formStatus: Ref<string | null>;
  detailFunc: Ref<((id: string | number) => Promise<DetailResponse>) | null>;
  render: Ref<boolean>;
  setData: (status: string, form: FormRecord) => Promise<Ref<FormRecord>>;
  setDisabled: (option: FormOption, disabled: boolean) => FormOption;
  setColumnData: (option: FormOption, prop: string, key: string, value: unknown) => void;
  forceUpdate: () => void;
}

export default (): UseFormReturn => {
  const key = ref(1);
  const loading = ref(false);
  const detailFunc = ref<((id: string | number) => Promise<DetailResponse>) | null>(null);
  const dialog = ref<Record<string, unknown>>({});
  const form = ref<FormRecord>({});
  const formData = ref<FormRecord>({});
  const formStatus = ref<string | null>(null);
  const isDetail = computed(() => formStatus.value === website.pageStatus.DETAIL);
  const render = ref(false);

  function setData(status: string, formRecord: FormRecord): Promise<Ref<FormRecord>> {
    formStatus.value = status;

    return new Promise((resolve, reject) => {
      if (validatenull(formRecord.id)) {
        formData.value = formRecord;
        // FIX: 原代码 resolve(formData) 传入的是 Ref 本身，保持一致
        resolve(formData);
      } else {
        if (validatenull(detailFunc.value)) {
          // Element Plus 2.9.x 内部 EpPropFinalized 类型与公开 API 不兼容
          (ElMessage as unknown as (o: { message: string; type: string }) => void)({
            message: "未传入 detail 方法",
            type: "error",
          });
          reject(new Error("未传入 detail 方法"));
          return;
        }

        loading.value = true;
        const detailFn = detailFunc.value;
        const recordId = formRecord.id;
        if (!detailFn || recordId === undefined) {
          reject(new Error("detail 方法或 id 不存在"));
          return;
        }
        detailFn(recordId)
          .then(({ data }) => {
            formData.value = data.data;
            render.value = true;
            resolve(formData);
          })
          .catch((e: unknown) => {
            reject(e instanceof Error ? e : new Error(String(e)));
          })
          .finally(() => {
            loading.value = false;
          });
      }
    });
  }

  function setColumnData(option: FormOption, prop: string, key: string, value: unknown): void {
    const index = option.column.findIndex((item) => item.prop === prop);
    if (index === -1) {
      console.warn("未找到该配置");
      return;
    }
    const col = option.column[index];
    if (col) {
      col[key] = value;
    }
    forceUpdate();
  }

  function forceUpdate(): void {
    key.value += 1;
  }

  function setDisabled(option: FormOption, disabled: boolean): FormOption {
    option.column.forEach((item) => {
      item.disabled = disabled;
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

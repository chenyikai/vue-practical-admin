import { ref, reactive, computed, nextTick, type Ref, type ComputedRef } from "vue";
import { cleanVal, clearVal } from "@/utils/util";

interface PaginationState {
  pageIndex: number;
  pageSize: number;
  total: number;
  pageSizes: number[];
  orders: { id: string; type: "asc" | "desc" }[];
}

interface QueryParams {
  data: Record<string, unknown>;
  params: {
    pageIndex: number;
    pageSize: number;
  };
}

interface PageResponse {
  data: {
    data: {
      rows: unknown[];
      total: number | string;
    };
  };
}

interface ListResponse {
  data: {
    data: unknown[];
  };
}

interface CallbackResult {
  mainData: unknown[];
  total?: number;
}

interface FuncList {
  page: ((params: QueryParams) => Promise<PageResponse>) | null;
  list: ((params: Record<string, unknown>) => Promise<ListResponse>) | null;
  callback: ((params: QueryParams) => Promise<CallbackResult> | CallbackResult) | null;
}

interface UseCrudReturn {
  crud: Ref<Record<string, unknown>>;
  dialog: Ref<Record<string, unknown>>;
  funcList: FuncList;
  tableLoading: Ref<boolean>;
  mainTableData: Ref<unknown[]>;
  pagination: PaginationState;
  listQuery: Record<string, unknown>;
  queryParams: ComputedRef<QueryParams>;
  getList: () => void;
  handleFilter: () => void;
  sizeChange: (val: number) => void;
  currentChange: (val: number) => void;
  sortChange: (params: { prop: string; order: string }) => void;
  setFreezeData: (key: string, value: unknown) => void;
  handelResetSearchForm: () => void;
}

export default (): UseCrudReturn => {
  const funcList = reactive<FuncList>({
    page: null,
    list: null,
    callback: null,
  });

  const crud = ref<Record<string, unknown>>({});
  const mainTableData = ref<unknown[]>([]);
  const dialog = ref<Record<string, unknown>>({});

  const pagination = reactive<PaginationState>({
    pageIndex: 1,
    pageSize: 15,
    total: 0,
    pageSizes: [15, 30, 50, 100],
    orders: [],
  });

  // FIX: 改为 const + 原地修改，防止 reactive 丢失代理引用
  const listQuery = reactive<Record<string, unknown>>({});
  const freezeData = reactive<Record<string, unknown>>({});
  const tableLoading = ref(false);

  const queryParams = computed<QueryParams>(() => ({
    data: listQuery,
    params: {
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
    },
  }));

  function handleFilter(): void {
    // FIX: 原地修改而非重新赋值，保持 reactive 响应性
    cleanVal(listQuery);
    pagination.pageIndex = 1;
    void nextTick().then(() => {
      getList();
    });
  }

  function handelResetSearchForm(): void {
    // FIX: 原地清理
    clearVal(listQuery);
    Object.keys(freezeData).forEach((key) => {
      listQuery[key] = freezeData[key];
    });
    getList();
  }

  function setFreezeData(key: string, value: unknown): void {
    freezeData[key] = value;
    listQuery[key] = value;
  }

  function sizeChange(val: number): void {
    pagination.pageIndex = 1;
    pagination.pageSize = val;
    getList();
  }

  function currentChange(val: number): void {
    pagination.pageIndex = val;
    getList();
  }

  function sortChange({ prop, order }: { prop: string; order: string }): void {
    // FIX: 原代码写的是 pagination.order（未定义），应为 pagination.orders
    pagination.orders = [{ id: prop, type: order === "descending" ? "desc" : "asc" }];
    handleFilter();
  }

  function getList(): void {
    tableLoading.value = true;

    // 自定义查询方法（优先级最高，执行后直接返回）
    if (funcList.callback !== null && typeof funcList.callback === "function") {
      void Promise.resolve(funcList.callback(queryParams.value))
        .then(({ mainData, total }) => {
          mainTableData.value = mainData;
          pagination.total = total ?? 0;
        })
        .catch(console.error)
        .finally(() => {
          tableLoading.value = false;
        });
      return;
    }

    // 分页查询（与列表查询互斥）
    if (funcList.page !== null) {
      void funcList
        .page(queryParams.value)
        .then(({ data }) => {
          mainTableData.value = data.data.rows;
          pagination.total = Number(data.data.total);
        })
        .catch(console.error)
        .finally(() => {
          tableLoading.value = false;
        });
      return;
    }

    // 列表查询
    if (funcList.list !== null) {
      void funcList
        .list(listQuery)
        .then(({ data }) => {
          mainTableData.value = data.data;
        })
        .catch(console.error)
        .finally(() => {
          tableLoading.value = false;
        });
    }
  }

  return {
    crud,
    dialog,
    funcList,
    tableLoading,
    mainTableData,
    pagination,
    listQuery,
    queryParams,
    getList,
    handleFilter,
    sizeChange,
    currentChange,
    sortChange,
    setFreezeData,
    handelResetSearchForm,
  };
};

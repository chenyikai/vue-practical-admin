import { ref, reactive, computed, nextTick } from "vue";
import { cleanVal, clearVal } from "@/utils/util.js";

export default () => {
  const funcList = reactive({
    page: null,
    list: null,
    callback: null,
  });
  const crud = ref({});
  const mainTableData = ref([]);
  const dialog = ref({});
  const pagination = reactive({
    pageIndex: 1,
    pageSize: 15,
    total: 0,
    pageSizes: [15, 30, 50, 100],
    orders: [],
  });
  let listQuery = reactive({});
  const freezeData = reactive({});
  const tableLoading = ref(false);
  const queryParams = computed(() => {
    const { pageIndex, pageSize } = pagination;
    return {
      data: listQuery,
      params: {
        pageIndex,
        pageSize,
      },
    };
  });

  /**
   * 搜索
   */
  function handleFilter() {
    listQuery = cleanVal(listQuery);
    pagination.pageIndex = 1;
    nextTick().then(() => {
      getList();
    });
  }

  /**
   * 重置
   */
  function handelResetSearchForm() {
    listQuery = clearVal(listQuery);

    for (const freezeDataKey in freezeData) {
      listQuery[freezeDataKey] = freezeData[freezeDataKey];
    }
    getList();
  }

  /**
   * 冻结数据 不会被handelResetSearchForm清除
   * @param key 数据的key
   * @param value 数据的值
   */
  function setFreezeData(key, value) {
    freezeData[key] = value;
    listQuery[key] = value;
  }

  /**
   * 页面pageSize变化
   * @param val pageSize
   */
  function sizeChange(val) {
    pagination.pageIndex = 1;
    pagination.pageSize = val;
    getList();
  }

  /**
   * 页面pageIndex变化
   * @param val pageIndex
   */
  function currentChange(val) {
    pagination.pageIndex = val;
    getList();
  }

  function sortChange({ prop, order }) {
    pagination.order = [
      { id: prop, type: order === "descending" ? "desc" : "asc" },
    ];

    handleFilter();
  }

  /**
   * 获取列表
   */
  function getList() {
    tableLoading.value = true;

    // 自定义查询方法
    if (funcList.callback && typeof funcList.callback === "function") {
      if (
        funcList.callback(queryParams.value) &&
        funcList.callback(queryParams.value).then
      ) {
        funcList.callback(queryParams.value).then(({ mainData, total }) => {
          mainTableData.value = mainData;
          pagination.total = total || 0;
          tableLoading.value = false;
        });
      } else {
        console.error("自定义查询方法需返回Promise");
      }
      return;
    }

    // 分页查询
    if (funcList.page) {
      funcList.page(queryParams.value).then(({ data }) => {
        mainTableData.value = data.data.rows;
        pagination.total = Number(data.data.total);
        tableLoading.value = false;
      });
    }

    // 列表查询
    if (funcList.list) {
      funcList.list(listQuery).then(({ data }) => {
        mainTableData.value = data.data;
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

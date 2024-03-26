import { getDictData } from "@/utils/util.js";
import { reactive } from "vue";

export default () => {
  const shortCrudOption = reactive({
    header: false,
    addBtn: false,
    columnBtn: false,
    selection: true,
    refreshBtn: false,
    index: true,
    border: true,
    stripe: true,
    menu: false,
    headerAlign: "center",
    align: "center",
    height: "auto",
    calcHeight: 10,
    column: [
      {
        label: "养殖证编号",
        prop: "menuName",
        align: "left",
      },
      {
        label: "申请人",
        prop: "type",
        type: "select",
        dataType: "number",
        dicData: getDictData("menu_type"),
      },
      {
        label: "申请类型",
        prop: "path",
        align: "left",
      },
      {
        label: "样式方式",
        prop: "permissions",
      },
      {
        label: "面积(公顷)",
        prop: "sort",
      },
      {
        label: "数据来源",
        prop: "keepAlive",
        type: "select",
        dicData: [
          { label: "缓存", value: 0 },
          { label: "不缓存", value: 1 },
        ],
      },
      {
        label: "状态",
        prop: "keepAlive",
        type: "select",
        dicData: [
          { label: "缓存", value: 0 },
          { label: "不缓存", value: 1 },
        ],
      },
      {
        label: "操作",
        prop: "menu",
        width: 250,
        slot: true,
      },
    ],
  });

  const longCrudOption = reactive({
    header: false,
    addBtn: false,
    columnBtn: false,
    selection: true,
    refreshBtn: false,
    index: true,
    border: true,
    stripe: true,
    menu: false,
    headerAlign: "center",
    align: "center",
    height: "auto",
    calcHeight: 10,
    column: [
      {
        label: "养殖证编号",
        prop: "menuName",
        align: "left",
      },
      {
        label: "申请人",
        prop: "type",
        type: "select",
        dataType: "number",
        dicData: getDictData("menu_type"),
      },
      {
        label: "申请类型",
        prop: "path",
        align: "left",
      },
      {
        label: "样式方式",
        prop: "permissions",
      },
      {
        label: "面积(公顷)",
        prop: "sort",
      },
      {
        label: "数据来源",
        prop: "keepAlive",
        type: "select",
        dicData: [
          { label: "缓存", value: 0 },
          { label: "不缓存", value: 1 },
        ],
      },
      {
        label: "状态",
        prop: "keepAlive",
        type: "select",
        dicData: [
          { label: "缓存", value: 0 },
          { label: "不缓存", value: 1 },
        ],
      },
      {
        label: "操作",
        prop: "menu",
        width: 250,
        slot: true,
      },
    ],
  });

  return {
    shortCrudOption,
    longCrudOption,
  };
};

// import { getDictData } from "@/utils/util.js";

export const crudOption = {
  header: false,
  addBtn: false,
  columnBtn: false,
  refreshBtn: false,
  index: true,
  border: true,
  stripe: true,
  menu: false,
  headerAlign: "center",
  align: "center",
  height: "auto",
  calcHeight: 50,
  column: [
    {
      label: "名称",
      prop: "name",
    },
    {
      label: "编码",
      prop: "code",
    },
    {
      label: "类型创建时间",
      prop: "createDate",
    },
    {
      label: "最后修改时间",
      prop: "updateDate",
    },
    {
      label: "操作",
      prop: "menu",
      slot: true,
      width: 200,
    },
  ],
};

export const formOption = {
  menuBtn: false,
  labelWidth: 100,
  labelPosition: "right",
  column: [
    {
      label: "类型名称",
      prop: "name",
      span: 24,
      rules: [{ required: true, message: "不能为空", trigger: "blur" }],
    },
    {
      label: "类型编码",
      prop: "code",
      disabled: true,
      span: 12,
    },
    {
      label: "点图标",
      prop: "icon",
      span: 12,
      type: "select",
      dicData: [
        { label: "默认图标", value: "point" },
        { label: "边检", value: "bianjian" },
        { label: "泊位", value: "bowei" },
        { label: "船舶代理", value: "chuanbodaili" },
        { label: "船舶维修", value: "chuanboweixiu" },
        { label: "船供公司", value: "chuangonggongsi" },
        { label: "船坞", value: "chuanwu" },
        { label: "港务部门", value: "gangwubumen" },
        { label: "供油服务", value: "gongyoufuwu" },
        { label: "海关", value: "haiguan" },
        { label: "海事", value: "haishi" },
        { label: "码头", value: "matou" },
        { label: "能源企业", value: "nengyuanqiye" },
        { label: "图书资料", value: "tushuziliao" },
        { label: "应急", value: "yingji" },
        { label: "渔港", value: "yugang" },
        { label: "渔业", value: "yuye" },
        { label: "造船企业", value: "zaochuanqiye" },
      ],
      rules: [{ required: true, message: "不能为空", trigger: "blur" }],
    },
  ],
};

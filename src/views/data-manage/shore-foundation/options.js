import { getDictData } from "@/utils/util.js";
import { reactive } from "vue";

export const crudOption = {
  header: false,
  addBtn: false,
  columnBtn: false,
  refreshBtn: false,
  index: true,
  border: true,
  stripe: false,
  menu: false,
  selection: true,
  tip: false,
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
      label: "数据类型",
      prop: "typeCode",
      props: {
        label: "name",
        value: "code",
      },
      dicData: [],
    },
    {
      label: "海区",
      prop: "seaCode",
      props: {
        label: "name",
        value: "code",
      },
      dicData: [],
    },
    {
      label: "审核状态",
      prop: "feedbackStatus",
      dicData: getDictData("audit_status"),
      slot: true,
    },
    {
      label: "发布状态",
      prop: "pubStatus",
      dicData: getDictData("publish_status"),
    },
    {
      label: "发布时间",
      prop: "pubTime",
    },
    {
      label: "操作",
      prop: "menu",
      slot: true,
      width: 100,
    },
  ],
};

export const formOption = {
  menuBtn: false,
  labelWidth: 100,
  labelPosition: "right",
  column: [
    {
      label: "中文名称",
      prop: "name",
      span: 24,
      rules: [{ required: true, message: "不能为空", trigger: "blur" }],
      placeholder: " ",
    },
    {
      label: "英文名称",
      prop: "enName",
      span: 24,
      // rules: [{ required: true, message: "不能为空", trigger: "blur" }],
      placeholder: " ",
    },
    {
      label: "海区",
      prop: "seaCode",
      type: "select",
      span: 24,
      dataType: "string",
      dicData: [],
      props: {
        label: "name",
        value: "code",
      },
      rules: [{ required: true, message: "不能为空", trigger: "change" }],
      placeholder: " ",
    },
    {
      label: "类型",
      prop: "typeCode",
      type: "select",
      span: 24,
      dataType: "string",
      filterable: true,
      props: {
        label: "name",
        value: "code",
      },
      dicData: [],
      rules: [{ required: true, message: "不能为空", trigger: "change" }],
      placeholder: " ",
    },
    // {
    //   label: "所属区域",
    //   prop: "country",
    //   type: "select",
    //   span: 24,
    //   dicData: [
    //     { label: "中国", value: "CN" },
    //     { label: "国外", value: "F" },
    //   ],
    //   rules: [{ required: true, message: "不能为空", trigger: "change" }],
    // },
    {
      label: "备注",
      prop: "remark",
      placeholder: " ",
      span: 24,
    },
  ],
};

export default function useFormOption() {
  const formOption = reactive({
    menuBtn: false,
    labelWidth: 100,
    labelPosition: "right",
    column: [
      {
        label: "中文名称",
        prop: "name",
        span: 24,
        rules: [{ required: true, message: "不能为空", trigger: "blur" }],
        placeholder: " ",
      },
      {
        label: "英文名称",
        prop: "enName",
        span: 24,
        // rules: [{ required: true, message: "不能为空", trigger: "blur" }],
        placeholder: " ",
      },
      {
        label: "海区",
        prop: "seaCode",
        type: "select",
        span: 24,
        dataType: "string",
        dicData: [],
        props: {
          label: "name",
          value: "code",
        },
        rules: [{ required: true, message: "不能为空", trigger: "change" }],
        placeholder: " ",
      },
      {
        label: "类型",
        prop: "typeCode",
        type: "select",
        span: 24,
        dataType: "string",
        filterable: true,
        props: {
          label: "name",
          value: "code",
        },
        dicData: [],
        rules: [{ required: true, message: "不能为空", trigger: "change" }],
        placeholder: " ",
      },
      // {
      //   label: "所属区域",
      //   prop: "country",
      //   type: "select",
      //   span: 24,
      //   dicData: [
      //     { label: "中国", value: "CN" },
      //     { label: "国外", value: "F" },
      //   ],
      //   rules: [{ required: true, message: "不能为空", trigger: "change" }],
      // },
      {
        label: "备注",
        prop: "remark",
        placeholder: " ",
        span: 24,
      },
    ],
  });
  return { formOption };
}

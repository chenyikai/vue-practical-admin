import { textSizeList, lineWidth, haloWidthList } from "./enum";

export const pointFormConfig = [
  {
    label: "名称",
    prop: "name",
    span: 24,
    rules: { required: true, message: "不能为空", trigger: "blur" },
  },
  {
    label: "分组",
    prop: "teamId",
    span: 24,
    type: "team",
    rules: { required: true, message: "不能为空", trigger: "change" },
  },
  {
    label: "文字颜色",
    prop: "text-color",
    span: 24,
    type: "color",
  },
  {
    label: "文字大小",
    prop: "text-size",
    span: 24,
    type: "radio",
    dicData: textSizeList,
  },
  {
    label: "描边宽度",
    prop: "text-halo-width",
    span: 24,
    type: "radio",
    dicData: haloWidthList,
  },
  {
    label: "描边颜色",
    prop: "text-halo-color",
    span: 24,
    type: "color",
  },
];

export const lineFormConfig = [
  {
    label: "名称",
    prop: "name",
    span: 24,
    rules: { required: true, message: "不能为空", trigger: "blur" },
  },
  {
    label: "分组",
    prop: "teamId",
    span: 24,
    type: "team",
    rules: { required: true, message: "不能为空", trigger: "change" },
  },
  {
    label: "线宽",
    prop: "line-width",
    span: 24,
    type: "radio",
    dicData: lineWidth,
  },
  {
    label: "文字颜色",
    prop: "text-color",
    span: 24,
    type: "color",
  },
  {
    label: "线颜色",
    prop: "line-color",
    span: 24,
    type: "color",
  },
  {
    label: "文字大小",
    prop: "text-size",
    span: 24,
    type: "radio",
    dicData: textSizeList,
  },
];

export const polygonFormConfig = [
  {
    label: "名称",
    prop: "name",
    span: 24,
    rules: { required: true, message: "不能为空", trigger: "blur" },
  },
  {
    label: "分组",
    prop: "teamId",
    span: 24,
    type: "team",
    rules: { required: true, message: "不能为空", trigger: "change" },
  },
  {
    label: "线宽",
    prop: "line-width",
    span: 24,
    type: "radio",
    dicData: lineWidth,
  },
  {
    label: "文字颜色",
    prop: "text-color",
    span: 24,
    type: "color",
  },
  {
    label: "线颜色",
    prop: "line-color",
    span: 24,
    type: "color",
  },
  {
    label: "文字大小",
    prop: "text-size",
    dicData: textSizeList,
    type: "radio",
    span: 24,
  },
  {
    label: "面填充色",
    prop: "fill-color",
    type: "color",
    span: 24,
  },
  {
    label: "面透明度",
    prop: "fill-opacity",
    type: "number",
    span: 24,
    min: 0,
    max: 1,
    step: 0.1,
    precision: 1,
  },
];

export const circleFormConfig = [
  {
    label: "名称",
    prop: "name",
    span: 24,
    rules: { required: true, message: "不能为空", trigger: "blur" },
  },
  {
    label: "分组",
    prop: "teamId",
    span: 24,
    type: "team",
    rules: { required: true, message: "不能为空", trigger: "change" },
  },
  {
    label: "线宽",
    prop: "line-width",
    span: 24,
    type: "radio",
    dicData: lineWidth,
  },
  {
    label: "文字颜色",
    prop: "text-color",
    span: 24,
    type: "color",
  },
  {
    label: "线颜色",
    prop: "line-color",
    span: 24,
    type: "color",
  },
  {
    label: "文字大小",
    prop: "text-size",
    dicData: textSizeList,
    type: "radio",
    span: 24,
  },
  {
    label: "面填充色",
    prop: "fill-color",
    type: "color",
    span: 24,
  },
  {
    label: "面透明度",
    prop: "fill-opacity",
    type: "number",
    span: 24,
    min: 0,
    max: 1,
    step: 0.1,
    precision: 1,
  },
];

export const fenceFormConfig = [
  {
    label: "名称",
    prop: "name",
    span: 24,
    rules: { required: true, message: "不能为空", trigger: "blur" },
  },
  {
    label: "分组",
    prop: "teamId",
    span: 24,
    type: "team",
    rules: { required: true, message: "不能为空", trigger: "change" },
  },
  {
    label: "实际航线",
    prop: "line",
    span: 24,
    rows: 4,
    type: "textarea",
    // rules: { required: true, message: "不能为空", trigger: "blur" },
  },
  {
    label: "线宽",
    prop: "line-width",
    span: 24,
    type: "radio",
    dicData: lineWidth,
  },
  {
    label: "文字颜色",
    prop: "text-color",
    span: 24,
    type: "color",
  },
  {
    label: "线颜色",
    prop: "line-color",
    span: 24,
    type: "color",
  },
  {
    label: "文字大小",
    prop: "text-size",
    dicData: textSizeList,
    type: "radio",
    span: 24,
  },
  {
    label: "面填充色",
    prop: "fill-color",
    type: "color",
    span: 24,
  },
  {
    label: "面透明度",
    prop: "fill-opacity",
    type: "number",
    span: 24,
    min: 0,
    max: 1,
    step: 0.1,
    precision: 1,
  },
];

export const stopFormConfig = [
  {
    label: "名称",
    prop: "name",
    span: 24,
    rules: { required: true, message: "不能为空", trigger: "blur" },
  },
  {
    label: "开启状态",
    name: "status",
    span: 24,
    type: "select",
    dicData: [
      {
        label: "开启",
        value: 1,
      },
      {
        label: "关闭",
        value: 0,
      },
    ],
    rules: { required: true, message: "不能为空", trigger: "change" },
  },
  {
    label: "线宽",
    prop: "line-width",
    span: 24,
    type: "radio",
    dicData: lineWidth,
  },
  {
    label: "文字颜色",
    prop: "text-color",
    span: 24,
    type: "color",
  },
  {
    label: "线颜色",
    prop: "line-color",
    span: 24,
    type: "color",
  },
  {
    label: "文字大小",
    prop: "text-size",
    dicData: textSizeList,
    type: "radio",
    span: 24,
  },
  {
    label: "面填充色",
    prop: "fill-color",
    type: "color",
    span: 24,
  },
  {
    label: "面透明度",
    prop: "fill-opacity",
    type: "number",
    span: 24,
    min: 0,
    max: 1,
    step: 0.1,
    precision: 1,
  },
];

export const playBackFormConfig = [
  {
    label: "名称",
    prop: "name",
    span: 24,
    rules: { required: true, message: "不能为空", trigger: "blur" },
  },
  {
    label: "开始时间",
    prop: "startTime",
    type: "datetime",
    span: 24,
    "value-format": "timestamp",
    rules: { required: true, message: "不能为空", trigger: "blur" },
  },
  {
    label: "结束时间",
    prop: "endTime",
    type: "datetime",
    span: 24,
    "value-format": "timestamp",
    rules: { required: true, message: "不能为空", trigger: "blur" },
  },
  {
    label: "提示",
    prop: "tips",
    type: "tips",
    content: "空间范围应不超过10000平方海里。时间范围应不超过一天",
  },
];

export const routeFormConfig = [
  {
    label: "名称",
    prop: "name",
    span: 24,
    rules: { required: true, message: "不能为空", trigger: "blur" },
  },
  {
    label: "分组",
    prop: "teamId",
    span: 24,
    type: "team",
    rules: { required: true, message: "不能为空", trigger: "change" },
  },
  {
    label: "线宽",
    prop: "line-width",
    span: 24,
    type: "radio",
    dicData: lineWidth,
  },
  {
    label: "文字颜色",
    prop: "text-color",
    span: 24,
    type: "color",
  },
  {
    label: "线颜色",
    prop: "line-color",
    span: 24,
    type: "color",
  },
  {
    label: "文字大小",
    prop: "text-size",
    span: 24,
    type: "radio",
    dicData: textSizeList,
  },
];

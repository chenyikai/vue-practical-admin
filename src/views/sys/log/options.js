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
  calcHeight: 30,
  column: [
    {
      label: "请求接口",
      prop: "url",
    },
    {
      label: "耗时",
      prop: "time",
      formatter({ time }) {
        return `${time}ms`;
      },
    },
    {
      label: "操作用户",
      prop: "username",
    },
    {
      label: "操作者IP",
      prop: "ip",
    },
    {
      label: "操作地点",
      prop: "location",
    },
    {
      label: "操作",
      prop: "menu",
      slot: true,
    },
  ],
};

export const formOption = {
  menuBtn: false,
  labelWidth: 100,
  labelPosition: "right",
  column: [
    {
      label: "请求接口",
      prop: "url",
      span: 24,
    },
    {
      label: "操作者IP",
      prop: "ip",
      span: 12,
    },
    {
      label: "操作地点",
      prop: "location",
      span: 12,
    },
    {
      label: "操作用户",
      prop: "username",
      span: 12,
    },
    {
      label: "操作内容",
      prop: "operation",
      span: 12,
    },
    {
      label: "操作时间",
      prop: "createDate",
      span: 12,
    },
    {
      label: "耗时",
      prop: "time",
      append: "ms",
      span: 12,
    },
    {
      label: "操作方法",
      prop: "method",
      span: 24,
    },
    {
      label: "请求参数",
      prop: "params",
      span: 24,
    },
    {
      label: "返回值",
      prop: "result",
      span: 24,
    },
  ],
};

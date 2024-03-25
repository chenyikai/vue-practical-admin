export const collisionOption = {
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
  height: "475px",
  column: [
    {
      label: "本船名称",
      prop: "shipName",
    },
    {
      label: "MMSI",
      prop: "mmsi",
    },
    {
      label: "会遇船舶名称",
      prop: "meetShipName",
    },
    {
      label: "会遇船舶号",
      prop: "meetMmsi",
    },
    {
      label: "会遇时间",
      prop: "tcpa",
    },
    {
      label: "会遇距离",
      prop: "dcpa",
    },
    {
      label: "触发时间",
      prop: "happenTime",
    },
    // {
    //   label: "操作",
    //   prop: "menu",
    //   slot: true,
    //   width: 200,
    // },
  ],
};
//偏航
export const yawOption = {
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
  height: "475px",
  column: [
    {
      label: "船舶名称",
      prop: "shipName",
    },
    {
      label: "MMSI",
      prop: "mmsi",
    },
    {
      label: "航道名称",
      prop: "efName",
    },
    // {
    //   label: "发生时间",
    //   prop: "happenTime",
    // },
    {
      label: "触发开始时间",
      prop: "happenTimeBegin",
    },
    {
      label: "触发结束时间",
      prop: "happenTimeEnd",
    },
    {
      label: "纬度",
      prop: "lat",
    },
    {
      label: "经度",
      prop: "lon",
    },

    // {
    //   label: "操作",
    //   prop: "menu",
    //   slot: true,
    //   width: 200,
    // },
  ],
};
// 障碍物
export const obstacleOption = {
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
  height: "475px",
  column: [
    {
      label: "船舶名称",
      prop: "shipName",
    },
    {
      label: "MMSI",
      prop: "mmsi",
    },
    {
      label: "航道名称",
      prop: "efName",
    },
    // {
    //   label: "发生时间",
    //   prop: "happenTime",
    // },
    {
      label: "触发开始时间",
      prop: "happenTimeBegin",
    },
    {
      label: "触发结束时间",
      prop: "happenTimeEnd",
    },
    {
      label: "纬度",
      prop: "lat",
    },
    {
      label: "经度",
      prop: "lon",
    },
    // {
    //   label: "操作",
    //   prop: "menu",
    //   slot: true,
    //   width: 200,
    // },
  ],
};

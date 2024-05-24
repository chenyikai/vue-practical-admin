import moment from "moment";
import { formatLatitudeAndLongitude } from "@/utils/util.js";

export const INTERVAL = 1000 * 15;
export const OWN_SHIP = "own";
export const OUT_SHIP = "out";
export const GHOST_SHIP = "Ghost";

export const formConfig = [
  {
    prop: "cnName",
    label: "船名(中文)",
  },
  {
    prop: "enName",
    label: "船名(英文)",
  },
  {
    prop: "mmsi",
    label: "MMSI",
  },
  // {
  //   prop: "typeName",
  //   label: "船舶类型",
  // },
  {
    prop: "position",
    label: "位置",
    format: ({ shipData }) => {
      const { lon, lat } = shipData;
      const { longitude, latitude } = formatLatitudeAndLongitude(lon, lat);
      return `${longitude.text} ${latitude.text}`;
    },
  },
  // {
  //   prop: "navigationStatusName",
  //   label: "航行状态",
  // },
  {
    prop: "updateTime",
    label: "更新时间",
    format: ({ key, shipData }) => {
      const data = shipData[key];
      return moment(Number(data)).format("yyyy-MM-DD HH:mm:ss");
    },
  },
];

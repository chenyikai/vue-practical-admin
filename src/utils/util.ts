import * as CryptoJS from "crypto-js";
import { validatenull } from "./validate";
import { set, cloneDeep } from "lodash-es";
import { userStore } from "@/store/index";
import website from "@/config/website";

interface TreeProps {
  key: string;
  children: string;
}

type TreeNode = Record<string, unknown>;

interface DictEntry {
  value: string | number;
  label: string;
  [key: string]: unknown;
}

interface EncryptionParams {
  data: Record<string, unknown>;
  type: "Base64" | "AES";
  param: string[];
  key: string;
}

interface DegreeConfig {
  degreeDecimal: number;
  minuteDecimal: number;
  secondDecimal: number;
}

interface DegreeResult {
  value: string;
  degreeMinute: string;
  originValue: number;
  degree: string;
  minute: string;
  second: string;
}

interface CoordinateResult {
  text: string;
  get value(): string;
  get completeValue(): string;
  fmtValue: DegreeResult;
  name: string;
  nameEn: string;
}

/**
 * 把字符串化的函数还原为可执行函数
 * 请确保传入的字符串可信任，不得传入用户输入
 */
export function stringParseToFunction(str: string): unknown {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-call
  return new Function(`"use strict"; return (${str})`)();
}

/**
 * 通过指定值在树形数据中查找节点
 * FIX: 原代码递归时硬编码 item.children，现改为动态读取 item[props.children]
 */
export function findTreeItemById(
  dataList: TreeNode[],
  value: string | number,
  props: TreeProps = { key: "id", children: "children" },
): TreeNode | undefined {
  if (!Array.isArray(dataList)) {
    throw new Error("数据格式错误");
  }
  for (const item of dataList) {
    if (item[props.key] === value) {
      return item;
    }
    const childList = item[props.children];
    if (Array.isArray(childList) && childList.length > 0) {
      const found = findTreeItemById(childList as TreeNode[], value, props);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
}

/**
 * 动态插入 CSS
 */
export function loadStyle(url: string): void {
  const link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = url;
  document.getElementsByTagName("head")[0]?.appendChild(link);
}

/**
 * 判断路由是否相等（深度比较）
 */
export function diff(obj1: Record<string, unknown>, obj2: Record<string, unknown>): boolean {
  delete obj1["close"];
  delete obj2["command"];

  const o1 = obj1 instanceof Object;
  const o2 = obj2 instanceof Object;
  if (!o1 || !o2) {
    return obj1 === obj2;
  }
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  }
  for (const attr in obj1) {
    const t1 = obj1[attr] instanceof Object;
    const t2 = obj2[attr] instanceof Object;
    if (t1 && t2) {
      return diff(obj1[attr] as Record<string, unknown>, obj2[attr] as Record<string, unknown>);
    } else if (obj1[attr] !== obj2[attr]) {
      return false;
    }
  }
  return true;
}

/**
 * 生成随机 len 位数字
 */
export function randomLenNum(len?: number, date?: boolean): string {
  let random = Math.ceil(Math.random() * 100000000000000)
    .toString()
    .slice(0, len ?? 4);
  if (date) {
    random = `${random}${String(Date.now())}`;
  }
  return random;
}

/**
 * AES-CBC 加密
 */
export function encryptAES_CBC(content: string): string {
  const key = CryptoJS.enc.Utf8.parse(website.key);
  const iv = CryptoJS.enc.Utf8.parse(website.iv);
  const encrypted = CryptoJS.AES.encrypt(content, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding,
  });
  return encrypted.toString();
}

/**
 * 加密处理（支持 Base64 和 AES）
 */
export function encryption(params: EncryptionParams): Record<string, unknown> {
  const { data, type, param, key: ivKey } = params;
  const result: Record<string, unknown> = JSON.parse(JSON.stringify(data)) as Record<
    string,
    unknown
  >;

  if (type === "Base64") {
    param.forEach((ele) => {
      result[ele] = btoa(result[ele] as string);
    });
  } else {
    param.forEach((ele) => {
      const key = CryptoJS.enc.Latin1.parse(ivKey);
      const encrypted = CryptoJS.AES.encrypt(result[ele] as string, key, {
        iv: key,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding,
      });
      result[ele] = encrypted.toString();
    });
  }
  return result;
}

/**
 * 对象序列化为 query string
 */
export function serialize(data: Record<string, unknown>): string {
  return Object.keys(data)
    .map((ele) => `${ele}=${String(data[ele])}`)
    .join("&");
}

type ObjType =
  | "boolean"
  | "number"
  | "string"
  | "function"
  | "array"
  | "date"
  | "regExp"
  | "undefined"
  | "null"
  | "object"
  | "element";

/**
 * 获取数据类型
 */
export function getObjType(obj: unknown): ObjType {
  const map: Record<string, ObjType> = {
    "[object Boolean]": "boolean",
    "[object Number]": "number",
    "[object String]": "string",
    "[object Function]": "function",
    "[object Array]": "array",
    "[object Date]": "date",
    "[object RegExp]": "regExp",
    "[object Undefined]": "undefined",
    "[object Null]": "null",
    "[object Object]": "object",
  };
  if (obj instanceof Element) {
    return "element";
  }
  return map[Object.prototype.toString.call(obj)] ?? "object";
}

/**
 * 清空数据值（保留 list 中指定的 key）
 */
export function clearVal(
  obj: Record<string, unknown> | null | undefined,
  list: string[] = [],
): Record<string, unknown> {
  if (!obj) {
    return {};
  }
  Object.keys(obj).forEach((ele) => {
    if (!list.includes(ele) && !validatenull(obj[ele])) {
      const type = getObjType(obj[ele]);
      if (type === "array") {
        obj[ele] = [];
      } else if (type === "object") {
        obj[ele] = {};
      } else if (["number", "boolean", "string"].includes(type)) {
        obj[ele] = undefined;
      } else {
        obj[ele] = "";
      }
    }
  });
  return obj;
}

/**
 * 清洗数据值（移除空值，过滤数组中的假值）
 */
export function cleanVal(obj: Record<string, unknown> | null | undefined): Record<string, unknown> {
  if (!obj) {
    return {};
  }
  Object.keys(obj).forEach((key) => {
    if (!obj[key] && obj[key] !== 0) {
      obj[key] = undefined;
    } else if (Array.isArray(obj[key])) {
      obj[key] = (obj[key] as unknown[]).filter((item) => !!item);
    }
  });
  return obj;
}

/**
 * 浏览器全屏切换
 */
export function fullscreenToggel(): void {
  if (fullscreenEnable()) {
    exitFullScreen();
  } else {
    reqFullScreen();
  }
}

/**
 * 监听全屏变化事件
 */
export function listenfullscreen(callback: () => void): void {
  const listen = (): void => {
    callback();
  };
  document.addEventListener("fullscreenchange", listen);
  document.addEventListener("mozfullscreenchange", listen);
  document.addEventListener("webkitfullscreenchange", listen);
  document.addEventListener("msfullscreenchange", listen);
}

/**
 * 判断浏览器是否处于全屏
 */
export function fullscreenEnable(): boolean {
  const doc = document as Document & {
    mozIsFullScreen?: boolean;
    webkitIsFullScreen?: boolean;
  };
  return !!(document.fullscreenElement ?? doc.mozIsFullScreen ?? doc.webkitIsFullScreen);
}

/**
 * 请求全屏
 */
export function reqFullScreen(): void {
  const el = document.documentElement as HTMLElement & {
    webkitRequestFullscreen?: () => void;
    mozRequestFullScreen?: () => void;
  };
  void el.requestFullscreen().catch(() => {
    el.webkitRequestFullscreen?.();
    el.mozRequestFullScreen?.();
  });
}

/**
 * 退出全屏
 */
export function exitFullScreen(): void {
  const doc = document as Document & {
    webkitCancelFullScreen?: () => void;
    mozCancelFullScreen?: () => void;
  };
  void doc.exitFullscreen().catch(() => {
    doc.webkitCancelFullScreen?.();
    doc.mozCancelFullScreen?.();
  });
}

/**
 * 经纬度格式化
 */
export function formatLatitudeAndLongitude(
  longitude: number,
  latitude: number,
  config: DegreeConfig = { degreeDecimal: 4, minuteDecimal: 2, secondDecimal: 4 },
): { longitude: CoordinateResult; latitude: CoordinateResult } {
  const fmtLongitude = formatDegree(longitude, config);
  const fmtLatitude = formatDegree(latitude, config);
  const lonName = longitude >= 0 ? "东经" : "西经";
  const latName = latitude >= 0 ? "北纬" : "南纬";

  const lonNameEn = longitude >= 0 ? "E" : "W";
  const latNameEn = latitude >= 0 ? "N" : "S";

  return {
    longitude: {
      text: `${lonName} ${fmtLongitude.degreeMinute}`,
      get value() {
        return fmtLongitude.value;
      },
      get completeValue() {
        return `${fmtLongitude.value} ${lonNameEn}`;
      },
      fmtValue: fmtLongitude,
      name: lonName,
      nameEn: lonNameEn,
    },
    latitude: {
      text: `${latName} ${fmtLatitude.degreeMinute}`,
      get value() {
        return fmtLatitude.value;
      },
      get completeValue() {
        return `${fmtLatitude.value} ${latNameEn}`;
      },
      fmtValue: fmtLatitude,
      name: latName,
      nameEn: latNameEn,
    },
  };
}

/**
 * 度转度分秒
 */
export function formatDegree(
  value: number,
  config: DegreeConfig = { degreeDecimal: 6, minuteDecimal: 2, secondDecimal: 2 },
): DegreeResult {
  const absValue = Math.abs(value);
  const degree = Math.floor(absValue);
  const minute = (absValue - degree) * 60;
  const second = ((absValue - degree) * 3600) % 60;

  return {
    value: `${String(degree)}°${paddingZero(Math.floor(minute))}′${paddingZero(second.toFixed(config.secondDecimal))}″`,
    degreeMinute: `${String(degree)}°${minute.toFixed(config.minuteDecimal)}'`,
    originValue: value,
    degree: value.toFixed(config.degreeDecimal),
    minute: ((value - degree) * 60).toFixed(config.minuteDecimal),
    second: (((value - degree) * 3600) % 60).toFixed(config.secondDecimal),
  };
}

export function paddingZero(num: number | string, padding = 2): string {
  let result = String(num);
  let len = Math.floor(Number(num)).toString().length;
  while (len < padding) {
    result = `0${result}`;
    len++;
  }
  return result;
}

export function kvToJson(k: string[], v: unknown[][]): Record<string, unknown>[] {
  const list: Record<string, unknown>[] = [];
  v.forEach((valueItem) => {
    const data: Record<string, unknown> = {};
    valueItem.forEach((item, index) => {
      if (Array.isArray(item)) {
        set(data, "list", { k: k[index], v: item });
      } else {
        set(data, k[index] ?? "", item);
      }
    });
    list.push(data);
  });
  return list;
}

/**
 * 根据字典名称获取字典列表
 * FIX: 原代码 console.warn 使用了未定义的变量 name，已修正为 dictName
 */
export function getDictData(dictName: string, type: "number" | "string" = "number"): DictEntry[] {
  const dictAll = userStore().dictAll as Record<string, DictEntry[]>;
  if (Array.isArray(dictAll[dictName])) {
    return dictAll[dictName].map((dictEntry) => {
      const item = cloneDeep(dictEntry);
      item.value = type === "number" ? Number(dictEntry.value) : String(dictEntry.value);
      return item;
    });
  }
  console.warn(`未找��字典：${dictName}`);
  return [];
}

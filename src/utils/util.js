import * as CryptoJS from "crypto-js";
import { validatenull } from "./validate.js";
import { set } from "lodash";
import { userStore } from "@/store/index.js";

/**
 * 把字符串化的函数还原为可执行函数
 * 请确保传入的字符串可信任
 */
export function stringParseToFunction(str) {
  // eslint-disable-next-line no-new-func
  return new Function('"use strict"; return (' + str + ")")();
}

/**
 * 通过指定值查找对应数据
 */
export function findTreeItemById(
  dataList,
  value,
  props = { key: "id", children: "children" },
) {
  if (!Array.isArray(dataList) || (!value && value !== 0)) {
    throw new Error("数据格式错误");
  }
  for (const item of dataList) {
    if (item[props.key] === value) {
      return item;
    }
    if (
      Array.isArray(item[props.children]) &&
      item[props.children].length !== 0
    ) {
      const menuItem = findTreeItemById(item.children, value, props);
      if (menuItem) {
        return menuItem;
      }
    }
  }
}

/**
 * 动态插入css
 */
export function loadStyle(url) {
  const link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = url;
  const head = document.getElementsByTagName("head")[0];
  head.appendChild(link);
}

/**
 * 判断路由是否相等
 */
export function diff(obj1, obj2) {
  delete obj1.close;
  delete obj2.command;

  let o1 = obj1 instanceof Object;
  let o2 = obj2 instanceof Object;
  if (!o1 || !o2) {
    return obj1 === obj2;
  }
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  }
  for (let attr in obj1) {
    let t1 = obj1[attr] instanceof Object;
    let t2 = obj2[attr] instanceof Object;
    if (t1 && t2) {
      return diff(obj1[attr], obj2[attr]);
    } else if (obj1[attr] !== obj2[attr]) {
      return false;
    }
  }
  return true;
}

/**
 * 生成随机len位数字
 */
export function randomLenNum(len, date) {
  let random = "";
  random = Math.ceil(Math.random() * 100000000000000)
    .toString()
    .substr(0, len || 4);
  if (date) random = random + Date.now();
  return random;
}

/**
 *加密处理
 */
export function encryption(params) {
  let { data, type, param, key: ivKey } = params;
  const result = JSON.parse(JSON.stringify(data));
  if (type === "Base64") {
    param.forEach((ele) => {
      result[ele] = btoa(result[ele]);
    });
  } else {
    param.forEach((ele) => {
      var data = result[ele];
      var key = CryptoJS.enc.Latin1.parse(ivKey);
      var iv = key;
      // 加密
      var encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding,
      });
      result[ele] = encrypted.toString();
    });
  }
  return result;
}

/**
 * 对象序列化
 */
export function serialize(data) {
  const list = [];
  Object.keys(data).forEach((ele) => {
    list.push(`${ele}=${data[ele]}`);
  });
  return list.join("&");
}

/**
 * 获取数据类型
 */
export function getObjType(obj) {
  var toString = Object.prototype.toString;
  var map = {
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
  return map[toString.call(obj)];
}

// 清空数据值
export function clearVal(obj, list = []) {
  if (!obj) return {};
  Object.keys(obj).forEach((ele) => {
    if (!list.includes(ele) && !validatenull(obj[ele])) {
      const type = getObjType(obj[ele]);
      if (type === "array") obj[ele] = [];
      else if (type === "object") obj[ele] = {};
      else if (["number", "boolean", "string"].includes(type))
        obj[ele] = undefined;
      else obj[ele] = "";
    }
  });
  return obj;
}

// 清洗数据值
export function cleanVal(obj) {
  if (!obj) return {};
  Object.keys(obj).forEach((key) => {
    if (!obj[key] && obj[key] !== 0) {
      obj[key] = undefined;
    } else if (Array.isArray(obj[key])) {
      obj[key] = obj[key].filter((item) => !!item);
    }
  });
  return obj;
}

// 根据字典名称获取字典列表
// export function getDictData(dictName) {
//   const dictAll = store.getters.dictAll;
//   if (Array.isArray(dictAll[dictName])) {
//     return dictAll[dictName];
//   }
//   console.warn(`未找到字典：${name}`);
//   return [];
// }

/**
 * 浏览器判断是否全屏
 */
export function fullscreenToggel() {
  if (fullscreenEnable()) {
    exitFullScreen();
  } else {
    reqFullScreen();
  }
}

/**
 * esc监听全屏
 */
export function listenfullscreen(callback) {
  function listen() {
    callback();
  }

  document.addEventListener("fullscreenchange", function () {
    listen();
  });
  document.addEventListener("mozfullscreenchange", function () {
    listen();
  });
  document.addEventListener("webkitfullscreenchange", function () {
    listen();
  });
  document.addEventListener("msfullscreenchange", function () {
    listen();
  });
}

/**
 * 浏览器判断是否全屏
 */
export function fullscreenEnable() {
  return (
    document.isFullScreen ||
    document.mozIsFullScreen ||
    document.webkitIsFullScreen
  );
}

/**
 * 浏览器全屏
 */
export function reqFullScreen() {
  if (document.documentElement.requestFullScreen) {
    document.documentElement.requestFullScreen();
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.documentElement.webkitRequestFullScreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    document.documentElement.mozRequestFullScreen();
  }
}

/**
 * 浏览器退出全屏
 */
export function exitFullScreen() {
  if (document.documentElement.requestFullScreen) {
    document.exitFullScreen();
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.webkitCancelFullScreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    document.mozCancelFullScreen();
  }
}

/**
 * 经纬度格式化
 * @param { Number } longitude 经度
 * @param { Number } latitude 纬度
 * @param { Object } config 配置信息
 * @returns
 */
export function formatLatitudeAndLongitude(
  longitude,
  latitude,
  config = {
    degreeDecimal: 4,
    minuteDecimal: 2,
    secondDecimal: 4,
  },
) {
  let fmtLongitude = formatDegree(longitude, config);
  let fmtLatitude = formatDegree(latitude, config);
  const lonName = longitude >= 0 ? "东经" : "西经";
  const latName = latitude >= 0 ? "北纬" : "南纬";
  return {
    longitude: {
      text: `${lonName} ${fmtLongitude.degreeMinute}`,
      get value() {
        return this.fmtValue.value;
      },
      get completeValue() {
        return `${this.value} ${this.nameEn}`;
      },
      fmtValue: fmtLongitude,
      name: lonName,
      nameEn: longitude >= 0 ? "E" : "W",
    },
    latitude: {
      text: `${latName} ${fmtLatitude.degreeMinute}`,
      get value() {
        return this.fmtValue.value;
      },
      get completeValue() {
        return `${this.value} ${this.nameEn}`;
      },
      fmtValue: fmtLatitude,
      name: latName,
      nameEn: latitude >= 0 ? "N" : "S",
    },
  };
}

/**
 * 度转度分秒
 * @param {Number} value 度数
 * @param {Object} config 配置信息
 * @returns
 */
export function formatDegree(
  value,
  config = {
    degreeDecimal: 6,
    minuteDecimal: 2,
    secondDecimal: 2,
  },
) {
  let absValue = Math.abs(value);
  let degree = Math.floor(absValue);
  let minute = (absValue - degree) * 60;
  let second = ((absValue - degree) * 3600) % 60;

  return {
    value: `${degree}°${paddingZero(Math.floor(minute))}′${paddingZero(
      second.toFixed(config.secondDecimal),
    )}″`,
    degreeMinute: `${degree}°${minute.toFixed(config.minuteDecimal)}'`,
    originValue: value,
    degree: Number(value).toFixed(config.degreeDecimal),
    minute: ((value - degree) * 60).toFixed(config.minuteDecimal),
    second: (((value - degree) * 3600) % 60).toFixed(config.secondDecimal),
  };
}

export function paddingZero(num, padding = 2) {
  let len = Math.floor(num).toString().length;
  while (len < padding) {
    num = "0" + num;
    len++;
  }
  return num;
}

export function kvToJson(k, v) {
  const list = [];
  v.forEach((valueItem) => {
    let data = {};
    valueItem.forEach((item, index) => {
      if (Array.isArray(item)) {
        set(data, "list", {
          k: k[index],
          v: item,
        });
      } else {
        set(data, k[index], item);
      }
    });
    list.push(data);
  });
  return list;
}

export function getDictData(dictName) {
  const dictAll = userStore().dictAll;
  if (Array.isArray(dictAll[dictName])) {
    return dictAll[dictName];
  }
  console.warn(`未找到字典：${name}`);
  return [];
}

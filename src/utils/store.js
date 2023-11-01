import _ from "lodash";
import website from "@/config/website";
import { stringParseToFunction } from "@/utils/util.js";

const keyName = website.storageKey + "-";

/**
 * 设置storage缓存
 */
export function setStore(params) {
  let { name, content, session } = params;
  name = `${keyName}${name}`;
  if (typeof content === "function") {
    content = content.toString();
  }
  const obj = {
    dataType: typeof content,
    content: content,
    type: session ? "sessionstorage" : "localstorage",
    datetime: new Date().getTime(),
  };
  if (session) window.sessionStorage.setItem(name, JSON.stringify(obj));
  else window.localStorage.setItem(name, JSON.stringify(obj));
}

/**
 * 设置storage缓存
 */
export function getStore(params = {}) {
  let { name } = params;
  name = `${keyName}${name}`;
  let obj = {};
  obj = window.sessionStorage.getItem(name);
  if (_.isNull(obj)) {
    obj = window.localStorage.getItem(name);
  }
  if (_.isNull(obj)) {
    console.warn(`未找到缓存，${name}不存在！`);
    return;
  }

  try {
    obj = JSON.parse(obj);
  } catch (e) {
    return obj;
  }
  const basicTypes = ["string", "number", "boolean", "object"];
  if (basicTypes.includes(obj.type)) {
    return obj.content;
  } else if (obj.type === "function") {
    return stringParseToFunction(obj.content);
  }
  return obj.content;
}

/**
 * 删除storage
 */
export function removeStore(params = {}) {
  let { name, session } = params;
  name = `${keyName}${name}`;
  if (session) {
    window.sessionStorage.removeItem(name);
  } else {
    window.localStorage.removeItem(name);
  }
}

/**
 * 获取全部storage缓存
 */
export const getAllStore = (params = {}) => {
  const list = [];
  const { session } = params;
  if (session) {
    for (let i = 0; i <= window.sessionStorage.length; i++) {
      list.push({
        name: window.sessionStorage.key(i),
        content: getStore({
          name: window.sessionStorage.key(i),
          type: "session",
        }),
      });
    }
  } else {
    for (let i = 0; i <= window.localStorage.length; i++) {
      list.push({
        name: window.localStorage.key(i),
        content: getStore({ name: window.localStorage.key(i) }),
      });
    }
  }
  return list;
};

/**
 * 清空全部storage缓存
 */
export function clearStore(params = {}) {
  const { session } = params;
  if (session) {
    window.sessionStorage.clear();
  } else {
    window.localStorage.clear();
  }
}

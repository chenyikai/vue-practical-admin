import website from "@/config/website";
import { stringParseToFunction } from "@/utils/util";

const keyName = `${website.storageKey}-`;

interface StoredObject {
  dataType: string;
  content: unknown;
  type: "sessionstorage" | "localstorage";
  datetime: number;
}

interface SetStoreParams {
  name: string;
  content: unknown;
  session?: boolean;
}

interface GetStoreParams {
  name?: string;
  session?: boolean;
}

interface StoreEntry {
  name: string | null;
  content: unknown;
}

/**
 * 设置 storage 缓存
 */
export function setStore(params: SetStoreParams): void {
  const { session } = params;
  let { name, content } = params;
  name = `${keyName}${name}`;

  if (typeof content === "function") {
    content = (content as () => unknown).toString();
  }

  const obj: StoredObject = {
    dataType: typeof content,
    content,
    type: session ? "sessionstorage" : "localstorage",
    datetime: new Date().getTime(),
  };

  if (session) {
    window.sessionStorage.setItem(name, JSON.stringify(obj));
  } else {
    window.localStorage.setItem(name, JSON.stringify(obj));
  }
}

/**
 * 获取 storage 缓存
 */
export function getStore(params: GetStoreParams = {}): unknown {
  let { name } = params;
  name = `${keyName}${name ?? ""}`;

  let raw: string | null = window.sessionStorage.getItem(name);
  raw ??= window.localStorage.getItem(name);
  if (raw === null) {
    return undefined;
  }

  let obj: StoredObject;
  try {
    obj = JSON.parse(raw) as StoredObject;
  } catch {
    return raw;
  }

  // FIX: 原代码错误地检查 obj.type（存储位置），应检查 obj.dataType（数据类型）
  if (obj.dataType === "function") {
    return stringParseToFunction(obj.content as string);
  }
  return obj.content;
}

/**
 * 删除 storage
 */
export function removeStore(params: GetStoreParams = {}): void {
  const { session } = params;
  const name = `${keyName}${params.name ?? ""}`;

  if (session) {
    window.sessionStorage.removeItem(name);
  } else {
    window.localStorage.removeItem(name);
  }
}

/**
 * 获取全部 storage 缓存
 * FIX: 原代码 i <= length 改为 i < length，防止访问越界的 null key
 */
export const getAllStore = (params: GetStoreParams = {}): StoreEntry[] => {
  const list: StoreEntry[] = [];
  const { session } = params;

  if (session) {
    for (let i = 0; i < window.sessionStorage.length; i++) {
      const key = window.sessionStorage.key(i);
      if (key !== null) {
        list.push({ name: key, content: getStore({ name: key, session: true }) });
      }
    }
  } else {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key !== null) {
        list.push({ name: key, content: getStore({ name: key }) });
      }
    }
  }

  return list;
};

/**
 * 清空全部 storage 缓存
 */
export function clearStore(params: GetStoreParams = {}): void {
  if (params.session) {
    window.sessionStorage.clear();
  } else {
    window.localStorage.clear();
  }
}

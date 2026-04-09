/**
 * 验证是否为合法用户名
 */
export function isvalidUsername(str: string): boolean {
  const validMap = ["admin", "editor"];
  return validMap.includes(str.trim());
}

/**
 * 合法 URI
 */
export function validateURL(textval: string): boolean {
  const urlregex =
    /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return urlregex.test(textval);
}

/**
 * 邮箱
 */
export function isEmail(s: string): boolean {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s);
}

/**
 * 手机号码
 */
export function isMobile(s: string): boolean {
  return /^1[0-9]{10}$/.test(s);
}

/**
 * 电话号码
 */
export function isPhone(s: string): boolean {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s);
}

/**
 * URL 地址（包含 html 路径或 http/https 链接）
 */
export function isURL(s: string): boolean {
  if (s.includes("html")) {
    return true;
  }
  return /^http[s]?:\/\/.*/.test(s);
}

/**
 * 小写字母
 */
export function validateLowerCase(str: string): boolean {
  return /^[a-z]+$/.test(str);
}

/**
 * 大写字母
 */
export function validateUpperCase(str: string): boolean {
  return /^[A-Z]+$/.test(str);
}

/**
 * 大小写字母
 */
export function validatAlphabets(str: string): boolean {
  return /^[A-Za-z]+$/.test(str);
}

/**
 * 验证是否为 PC 端
 */
export const vaildatePc = (): boolean => {
  const userAgentInfo = navigator.userAgent;
  const agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
  return !agents.some((agent) => userAgentInfo.includes(agent));
};

/**
 * 验证邮箱
 */
export function validateEmail(email: string): boolean {
  const re =
    /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

const ID_CITY_MAP: Record<number, string> = {
  11: "北京",
  12: "天津",
  13: "河北",
  14: "山西",
  15: "内蒙古",
  21: "辽宁",
  22: "吉林",
  23: "黑龙江",
  31: "上海",
  32: "江苏",
  33: "浙江",
  34: "安徽",
  35: "福建",
  36: "江西",
  37: "山东",
  41: "河南",
  42: "湖北",
  43: "湖南",
  44: "广东",
  45: "广西",
  46: "海南",
  50: "重庆",
  51: "四川",
  52: "贵州",
  53: "云南",
  54: "西藏",
  61: "陕西",
  62: "甘肃",
  63: "青海",
  64: "宁夏",
  65: "新疆",
  71: "台湾",
  81: "香港",
  82: "澳门",
  91: "国外",
};

/**
 * 验��身份证号码，返回 [是否有错误, 错误信息]
 */
export function cardid(code: string): [boolean, string] {
  let result = true;
  let msg = "";

  if (!validatenull(code)) {
    if (code.length === 18) {
      if (!/(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(code)) {
        msg = "证件号码格式错误";
      } else if (!ID_CITY_MAP[Number(code.slice(0, 2))]) {
        msg = "地址编码错误";
      } else {
        const codeArr = code.split("");
        const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        const parity: (number | string)[] = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2, "x"];
        let sum = 0;
        for (let i = 0; i < 17; i++) {
          sum += Number(codeArr[i]) * (factor[i] ?? 0);
        }
        if (parity[sum % 11] !== codeArr[17]) {
          msg = "证件号码校验位错误";
        } else {
          result = false;
        }
      }
    } else {
      msg = "证件号码长度不为18位";
    }
  } else {
    msg = "证件号码不能为空";
  }

  return [result, msg];
}

/**
 * 验证手机号码，返回 [是否有错误, 错误信息]
 */
export function isvalidatemobile(phone: string): [boolean, string] {
  let result = true;
  let msg = "";
  const phoneRegex = /^0\d{2,3}-?\d{7,8}$/;

  if (!validatenull(phone)) {
    if (phone.length === 11) {
      if (phoneRegex.test(phone)) {
        msg = "手机号码格式不正确";
      } else {
        result = false;
      }
    } else {
      msg = "手机号码长度不为11位";
    }
  } else {
    msg = "手机号码不能为空";
  }

  return [result, msg];
}

/**
 * 验证姓名（2-4位汉字）
 */
export function validatename(name: string): boolean {
  return /^[\u4e00-\u9fa5]{2,4}$/.test(name);
}

/**
 * 验证是否为整数或小数
 * type=1: 允许小数；type=2: 仅整数
 */
export function validatenum(num: string | number, type: 1 | 2): boolean {
  const str = String(num);
  if (type === 1) {
    return !/[^\d.]/g.test(str);
  } else {
    return !/[^\d]/g.test(str);
  }
}

/**
 * 判断是否为空
 */
export function validatenull(val: unknown): boolean {
  if (typeof val === "boolean" || typeof val === "number") {
    return false;
  }
  if (val instanceof Array) {
    return val.length === 0;
  }
  if (val instanceof Object) {
    return JSON.stringify(val) === "{}";
  }
  return [null, undefined, "null", "undefined", ""].includes(val as null);
}

/**
 * 复杂密码验证（含大小写字母和数字，8-16位）
 */
export function validPassword(textVal: string): boolean {
  return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/.test(textVal);
}

/**
 * 验证数组是否为空
 */
export function validateArrEmpty(list: unknown): boolean {
  if (!Array.isArray(list)) {
    return true;
  }
  return list.length === 0;
}

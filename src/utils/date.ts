interface CalcDateResult {
  leave1: number;
  leave2: number;
  leave3: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * 计算两个时间戳之间的时间差
 */
export const calcDate = (date1: number, date2: number): CalcDateResult => {
  const date3 = date2 - date1;
  const days = Math.floor(date3 / (24 * 3600 * 1000));
  const leave1 = date3 % (24 * 3600 * 1000);
  const hours = Math.floor(leave1 / (3600 * 1000));
  const leave2 = leave1 % (3600 * 1000);
  const minutes = Math.floor(leave2 / (60 * 1000));
  const leave3 = leave2 % (60 * 1000);
  const seconds = Math.round(date3 / 1000);
  return { leave1, leave2, leave3, days, hours, minutes, seconds };
};

/**
 * 日期格式化
 * @param DATE 日期（Date 对象、时间戳或字符串）
 * @param format 格式化模板，默认 'yyyy-MM-dd hh:mm:ss'
 */
export function dateFormat(DATE: Date | number | string, format = "yyyy-MM-dd hh:mm:ss"): string {
  let fmt = format;
  const dateVal = typeof DATE === "string" ? new Date(DATE.replace(/-/g, "/")) : new Date(DATE);

  if (dateVal.toString() === "Invalid Date") {
    return "";
  }

  const year = String(dateVal.getFullYear());
  // 替换年份（使用 replace 回调避免废弃的 RegExp.$1）
  fmt = fmt.replace(/(y+)/g, (match) => year.slice(4 - match.length));

  const o: Record<string, number> = {
    "M+": dateVal.getMonth() + 1,
    "d+": dateVal.getDate(),
    "h+": dateVal.getHours(),
    "m+": dateVal.getMinutes(),
    "s+": dateVal.getSeconds(),
    "q+": Math.floor((dateVal.getMonth() + 3) / 3),
    S: dateVal.getMilliseconds(),
  };

  for (const k of Object.keys(o)) {
    fmt = fmt.replace(new RegExp(`(${k})`), (match) => {
      const val = String(o[k] ?? 0);
      return match.length === 1 ? val : `00${val}`.slice(-match.length);
    });
  }

  return fmt;
}

export function paddingZero(num, padding = 2) {
  let len = Math.floor(num).toString().length;
  while (len < padding) {
    num = "0" + num;
    len++;
  }
  return num;
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
  }
) {
  let absValue = Math.abs(value);
  let degree = Math.floor(absValue);
  let minute = (absValue - degree) * 60;
  let second = ((absValue - degree) * 3600) % 60;

  let result = {
    value: `${degree}°${paddingZero(Math.floor(minute))}′${paddingZero(
      second.toFixed(config.secondDecimal)
    )}″`,
    originValue: value,
    degree: Number(value).toFixed(config.degreeDecimal),
    minute: ((value - degree) * 60).toFixed(config.minuteDecimal),
    second: (((value - degree) * 3600) % 60).toFixed(config.secondDecimal),
  };
  return result;
}

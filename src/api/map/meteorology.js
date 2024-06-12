import request from "@/router/axios.js";

// 大风预报列表v1
export function getBigWindForecastList() {
  return request({
    url: "/rest/ehhWeather/get_big_wind_forecast_list",
    method: "post",
  });
}

// 读取 ehh 文件，参数url
export function getEhhTxt(data) {
  return request({
    url: "/rest/ehhWeather/getEhhTxt",
    method: "post",
    data,
  });
}

export function findComplexByComplexId(codes) {
  return request({
    url: "/rest/ehhWeather/get_typhoons_detail",
    method: "post",
    data: { codes: codes },
  });
}

export function findComplexByYear(year) {
  return request({
    url: "/rest/ehhWeather/get_typhoons",
    method: "post",
    data: { year },
  });
}

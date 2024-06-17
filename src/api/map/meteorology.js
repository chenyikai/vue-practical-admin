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

// 获取渔场列表v1(包含每个渔场当前预报值)
export function getAreasWithCurrentForecast() {
  return request({
    method: "get",
    url: "/weather/prod/fishing_ground/forecast/v1/get_areas_with_current_forecast",
  });
}

// 获取渔场预报详情v1
export function getAreaForecastDetail(params) {
  return request({
    method: "get",
    url: "/weather/prod/fishing_ground/forecast/v1/get_area_forecast_detail",
    params,
  });
}

// 获取渔场气象列表v1(6小时预报一次数据: 格式；上午、下午、上半夜、下半夜)
export function getAreasWithSixHourForecast(params) {
  return request({
    method: "post",
    url: "/rest/ehhWeather/fishing_ground_get_areas_with_six_hour_forecast",
    params,
    transformResponse: function (data) {
      const map = new Map();
      const datetimeSet = new Set();
      const responseData = JSON.parse(data).data;
      for (let values of responseData.v) {
        const [areaCode, list] = values;
        // const areaCode = values[4];
        // const list = values[5];
        const datetimeMap = new Map();
        for (let datetimeItem of list) {
          const [forecastTime, windLevel, windZLevel, windDirection, wave] =
            datetimeItem;
          datetimeMap.set(forecastTime, {
            windLevel,
            windZLevel,
            windDirection,
            wave,
          });
          datetimeSet.add(forecastTime);
        }
        map.set({ code: areaCode }, datetimeMap);
      }
      return {
        dataset: map,
        datetimeList: [...datetimeSet],
        responseData: responseData,
      };
    },
  });
}

// 获取所有渔场气象列表v1(包含未来10天预报)
export function getAreasWithAllForecast(params) {
  return request({
    method: "get",
    url: "/weather/prod/fishing_ground/forecast/v1/get_areas_with_all_forecast",
    params,
  });
}

// 获取阵风颜色列表
export function getWindZlevelColors() {
  return request({
    method: "post",
    url: "/rest/ehhWeather/get_wind_zlevel_colors",
  });
}

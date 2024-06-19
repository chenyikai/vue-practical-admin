import request from "@/router/axios.js";

// 获取全部属性列表
// /demoserver/rest/ehhWeather/get_random_point_weather

export function get_random_point_weather(data) {
  return request.post(`/rest/ehhWeather/get_random_point_weather`, data);
}

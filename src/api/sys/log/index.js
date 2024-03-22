import request from "@/router/axios.js";

export const BASE_URL = "/rest/sys/log";

// 分页获取日志数据
export function getLogPage(queryWrapper) {
  return request({
    method: "post",
    url: `${BASE_URL}/getPage`,
    data: queryWrapper.data,
    params: queryWrapper.params,
  });
}

export function logDetail(id) {
  return request.post(`${BASE_URL}/getDetail`, { id });
}

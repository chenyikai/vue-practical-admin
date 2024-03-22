import request from "@/router/axios.js";

export const BASE_URL = "/rest/sys/session";

// 踢除用户
export function kickoutLiveData(id) {
  return request.get(`${BASE_URL}/kickout/${id}`);
}

// 查询在线用户会话列表
export function getLiveList(queryWrapper) {
  return request({
    method: "post",
    url: `${BASE_URL}/getList`,
    data: queryWrapper.data,
    params: queryWrapper.params,
  });
}

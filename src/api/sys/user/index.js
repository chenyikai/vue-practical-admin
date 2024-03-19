import request from "@/router/axios.js";

export const BASE_URL = "/rest/sys/user";

// 分页获取用户数据
export function getUserPage(queryWrapper) {
  return request({
    method: "post",
    url: `${BASE_URL}/getPage`,
    data: queryWrapper.data,
    params: queryWrapper.params,
  });
}

// 删除用户
export function deleteUserById(id) {
  return request.post(`${BASE_URL}/delete`, { id });
}

// 新增用户
export function createUser(formData) {
  return request.post(`${BASE_URL}/add`, formData);
}

// 修改用户
export function updateUser(formData) {
  return request.post(`${BASE_URL}/update`, formData);
}

//重置密码
export function resetPwd(formData) {
  return request.post(`${BASE_URL}/resetPwd`, formData);
}

export function userDetail(id) {
  return request.post(`${BASE_URL}/getDetail`, { id });
}

import request from "@/router/axios.js";

export const BASE_URL = "/rest/ptApiInfo";

export function getApiPage(queryWrapper) {
    return request({
        method: "post",
        url: `${BASE_URL}/getPage`,
        data: queryWrapper.data,
        params: queryWrapper.params,
    });
}

export function apiDetail(id) {
    return request.post(`${BASE_URL}/getDetail`, { id });
}

export function updateApi(data) {
    return request.post(`${BASE_URL}/update`, data);
}

export function createApi(data) {
    return request.post(`${BASE_URL}/add`, data);
}
// 删除部门机构
export function deleteApi(id) {
    return request.post(`${BASE_URL}/delete`, { id });
}

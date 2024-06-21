import request from "@/router/axios.js";

export const BASE_URL = "/rest/ptUserRApi";

export function getApiPage(queryWrapper) {
    return request({
        method: "post",
        url: `${BASE_URL}/getPage`,
        data: queryWrapper.data,
        params: queryWrapper.params,
    });
}
export function getUserApiDetail(data) {
    return request.post(`${BASE_URL}/getListByUserId`, data);
}

export function updateApi(data) {
    return request.post(`${BASE_URL}/update`, data);
}

export function createApi(data) {
    return request.post(`${BASE_URL}/add`, data);
}

// 查询全部poi类型表-岸基列表
export function getAllTypeShore(queryWrapper) {
    return request({
        method: "post",
        url: `/rest/poiTTypeShore/getAllTypeShore`,
        data: queryWrapper.data,
        params: queryWrapper.params,
    });
}

// 查询全部poi类型表-海上列表
export function getAllpoiTTypeType(queryWrapper) {
    return request({
        method: "post",
        url: `/rest/poiTType/getAllType`,
        data: queryWrapper.data,
        params: queryWrapper.params,
    });
}

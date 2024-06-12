import request from "@/router/axios.js";

export const BASE_URL = "/rest/poiTInfo";

// 获取岸基poi数据
export function getShorePoiList() {
  return request({
    method: "post",
    url: `/rest/poiTInfoShore/v1/getShorePoiList`,
  });
}

// 获取海上poi数据
export function getPoiList() {
  return request({
    method: "post",
    url: `/rest/poiTInfo/v1/getPoiList`,
  });
}
// 获取第一条
export function getDetailOne() {
  return request({
    method: "post",
    url: `/rest/ptSystemConfig/getDetailOne`,
  });
}

export function updatePtSystemConfig(data) {
  return request({
    method: "post",
    url: `/rest/ptSystemConfig/update`,
    data,
  });
}

// 获取海上poi数据(新接口)
export function getAllWithPoi() {
  return request({
    method: "post",
    url: `/rest/poiTType/getAllWithPoi`,
  });
}

// 获取岸基poi数据(新接口)
export function getAllWithPoiAnJi() {
  return request({
    method: "post",
    url: `/rest/poiTTypeShore/getAllWithPoi`,
  });
}
// 获取海上类型
export function getPagepoiTType() {
  return request({
    method: "post",
    url: `/rest/poiTType/getPage?pageIndex=1&pageSize=99`,
  });
}

// 获取岸基类型
export function getPagepoiTTypeShore() {
  return request({
    method: "post",
    url: `/rest/poiTTypeShore/getPage?pageIndex=1&pageSize=999`,
  });
}

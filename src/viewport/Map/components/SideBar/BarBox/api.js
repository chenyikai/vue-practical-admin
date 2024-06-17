import request from "@/router/axios.js";

// 海上数据
export function reqSeaData() {
  return request({
    method: "post",
    url: `/rest/poiTType/getAllWithPoi`,
  });
}

// 岸基数据
export function reqAnJiData() {
  return request({
    method: "post",
    url: `/rest/poiTTypeShore/getAllWithPoi`,
  });
}
// 海上类型
export function reqSeaType() {
  return request({
    method: "post",
    url: `/rest/poiTType/getPage?pageIndex=1&pageSize=999`,
  });
}

// 岸基类型
export function reqAnjiType() {
  return request({
    method: "post",
    url: `/rest/poiTTypeShore/getPage?pageIndex=1&pageSize=999`,
  });
}

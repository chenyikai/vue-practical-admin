import request from "@/router/axios.js";

// 获取海上数据类型
export function reqSeaData() {
  return request({
    method: "post",
    url: `/rest/poiTType/getPage?pageIndex=1&pageSize=999`,
  });
}

// 获取岸基数据类型
export function reqAnjiData() {
  return request({
    method: "post",
    url: `/rest/poiTTypeShore/getPage?pageIndex=1&pageSize=999`,
  });
}

import request from "@/router/axios.js";

// 查询poi类型关联属性列表
export function getPoiRTypeAttributeByTypeCode(formData) {
  return request.post(`/rest/poiRTypeAttribute/getListByTypeCode`, formData);
}

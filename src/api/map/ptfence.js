import request from "@/router/axios.js";

// 查询电子围栏表列表 getList
export function getPtShipFenceList() {
  return request({
    url: "/rest/ptShipFence/getList",
    method: "post",
  });
}

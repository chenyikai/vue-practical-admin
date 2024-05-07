import request from "@/router/axios.js";

export function getShipByKeyword(data) {
  return request({
    url: "/rest/ehhship/getShipByKeyword",
    method: "post",
    data,
  });
}

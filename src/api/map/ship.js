import request from "@/router/axios.js";

export function getShipPoiByMmsi(mmsi) {
  return request({
    url: "/rest/ehhship/getShipPoiByMmsi",
    method: "post",
    data: { mmsi },
  });
}

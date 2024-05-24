import request from "@/router/axios.js";

export function getShipPoiByMmsi(mmsi) {
  return request({
    url: "/rest/ehhship/getShipPoiByMmsi",
    method: "post",
    data: { mmsi },
  });
}

export function getGreenDot(data) {
  return request({
    url: "/rest/ehhship/getGreenPoiByRange",
    method: "post",
    data,
  });
}

export function getInternalShip() {
  return request({
    url: "/rest/onemap/getNbShipDataListNew",
    method: "post",
  });
}

export function getExternalShip(data) {
  return request({
    url: "/rest/ehhship/getShipDataList",
    method: "post",
    data,
  });
}

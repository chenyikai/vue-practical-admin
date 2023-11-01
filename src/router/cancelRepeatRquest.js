import Axios from "axios";

const pendingRequest = new Map();
export function addPendingRequest(config) {
  if (!config["cancelRequest"]) {
    return false;
  }
  const requestKey = generateReqKey(config);
  if (pendingRequest.has(requestKey)) {
    const cancelToken = pendingRequest.get(requestKey);
    cancelToken(requestKey);
    config.cancelToken = new Axios.CancelToken((cancel) => {
      pendingRequest.set(requestKey, cancel);
    });
  } else {
    config.cancelToken =
      config.cancelToken ||
      new Axios.CancelToken((cancel) => {
        pendingRequest.set(requestKey, cancel);
      });
  }
}

export function removePendingRequest(response) {
  if (response && response.config && response.config["cancelRequest"]) {
    const requestKey = generateReqKey(response.config);
    // 判断是否有这个 key
    if (pendingRequest.has(requestKey)) {
      const cancelToken = pendingRequest.get(requestKey);
      cancelToken(requestKey);
      pendingRequest.delete(requestKey);
    }
  }
}

function generateReqKey(config) {
  if (config && config.data && isJsonStr(config.data)) {
    config.data = JSON.parse(config.data);
  }
  const { method, url } = config;
  return [method, url].join("&");
}

function isJsonStr(str) {
  if (typeof str === "string") {
    try {
      const obj = JSON.parse(str);
      return typeof obj === "object" && obj;
    } catch (e) {
      throw new Error(e);
    }
  }
}

export default () => {
  let websocket = null;
  let callback = null;
  let lockReconnect = null;
  let heartInterVal = 20 * 1000;
  let heartbeatTimer = null;
  let connectTimer = null;

  function initSocket(url, cb) {
    callback = cb;
    websocket = new WebSocket(url);

    websocket.onopen = onOpen;
    websocket.onerror = onError;
    websocket.onmessage = onMessage;
    websocket.onclose = onClose;
  }

  function onOpen() {
    send("链接成功");
    heartbeat();
  }

  function send(msg) {
    websocket && websocket.send(msg);
  }

  function onError() {
    reConnect();
  }

  function onMessage(msg) {
    callback && callback(JSON.parse(msg.data), msg);
    reset();
  }

  function onClose() {}

  function reConnect() {
    // 重新连接
    if (lockReconnect) return;

    lockReconnect = true;
    // 没连接上会一直重连，设置延迟避免请求过多
    connectTimer && clearInterval(connectTimer);
    connectTimer = setInterval(() => {
      // 新连接
      this.initWebSocket();
      lockReconnect = false;
    }, 5000);
  }

  function reset() {
    heartbeatTimer && clearInterval(heartbeatTimer);
    connectTimer && clearInterval(connectTimer);
    // 重启心跳
    heartbeat();
  }

  function heartbeat() {
    // 开启心跳
    heartbeatTimer && clearInterval(heartbeatTimer);
    heartbeatTimer = setInterval(() => {
      // 这里发送一个心跳，后端收到后，返回一个心跳消息
      if (websocket && websocket.readyState === 1) {
        // 如果连接正常
        this.websock.send("心跳");
      } else {
        // 否则重连
        reConnect();
      }
    }, heartInterVal);
  }

  return {
    initSocket,
  };
};

type MessageCallback = (data: unknown, msg: MessageEvent) => void;

export default (): { initSocket: (url: string, cb: MessageCallback) => void } => {
  let websocket: WebSocket | null = null;
  let callback: MessageCallback | null = null;
  let lockReconnect = false;
  const heartInterVal = 20 * 1000;
  let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  let connectTimer: ReturnType<typeof setInterval> | null = null;
  let lastUrl = "";

  function initSocket(url: string, cb: MessageCallback): void {
    lastUrl = url;
    callback = cb;
    websocket = new WebSocket(url);

    websocket.onopen = onOpen;
    websocket.onerror = onError;
    websocket.onmessage = onMessage;
    websocket.onclose = onClose;
  }

  function onOpen(): void {
    send("链接成功");
    heartbeat();
  }

  function send(msg: string): void {
    if (websocket) {
      websocket.send(msg);
    }
  }

  function onError(): void {
    reConnect();
  }

  function onMessage(msg: MessageEvent): void {
    if (callback) {
      callback(JSON.parse(msg.data as string) as unknown, msg);
    }
    reset();
  }

  function onClose(): void {
    // noop
  }

  function reConnect(): void {
    if (lockReconnect) {
      return;
    }

    lockReconnect = true;
    if (connectTimer) {
      clearInterval(connectTimer);
    }
    connectTimer = setInterval(() => {
      initSocket(lastUrl, callback!);
      lockReconnect = false;
    }, 5000);
  }

  function reset(): void {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
    }
    if (connectTimer) {
      clearInterval(connectTimer);
    }
    heartbeat();
  }

  function heartbeat(): void {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
    }
    heartbeatTimer = setInterval(() => {
      if (websocket && websocket.readyState === 1) {
        websocket.send("心跳");
      } else {
        reConnect();
      }
    }, heartInterVal);
  }

  return {
    initSocket,
  };
};

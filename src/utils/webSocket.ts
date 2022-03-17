import { WEB_SOCKET_URL } from "../constants";
export const createWebSocket = () => {
  const webSocket = new WebSocket(WEB_SOCKET_URL);
  return webSocket;
};

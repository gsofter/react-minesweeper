// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { take, put, call, all } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import { WS } from "../../utils/webSocket";
import * as actions from "../reducers";

enum SocketMessageResponseType {
  CONNECTED = "connected",
  DISCONNECTED = "disconnected",
  NEW_GAME = "new",
  CELL_OPEN = "open",
  MAP_RECEIVED = "map",
}

const parseMapString = (mapStr: string) => {
  let cells: string[][] = [];
  const rows = mapStr.split("\n").slice(0, -1);
  cells = rows.map((row) => [...row.split("")]);
  return cells;
};

// this function creates an event channel from a given socket
// Setup subscription to incoming `ping` events
function createSocketChannel(ws: WebSocket) {
  // `eventChannel` takes a subscriber function
  // the subscriber function takes an `emit` argument to put messages onto the channel
  return eventChannel((emit) => {
    ws.onopen = () => {
      console.log("ws.onopen");
      emit({
        type: SocketMessageResponseType.CONNECTED,
      });
    };

    ws.onmessage = (event) => {
      const [eventType, data] = event.data.split(":");
      if (eventType === "new")
        emit({
          type: SocketMessageResponseType.NEW_GAME,
          data: data.slice(1, data.length),
        });
      else if (eventType === "open")
        emit({
          type: SocketMessageResponseType.CELL_OPEN,
          data: data.slice(1, data.length),
        });
      else if (eventType === "map" && data.length > 20) {
        emit({
          type: SocketMessageResponseType.MAP_RECEIVED,
          data: data.slice(1, data.length),
        });
      }
    };

    ws.onclose = () => {
      emit({
        type: SocketMessageResponseType.DISCONNECTED,
      });
    };

    // the subscriber must return an unsubscribe function
    // this will be invoked when the saga calls `channel.close` method
    const unsubscribe = () => {
      ws.close();
      console.log("unsubscribe");
    };

    return unsubscribe;
  });
}

function* websocketSaga(webSocket: WebSocket) {
  const socketChannel = yield call(createSocketChannel, webSocket);

  while (true) {
    try {
      // An error from socketChannel will cause the saga jump to the catch block
      const payload = yield take(socketChannel);
      if (payload.type === SocketMessageResponseType.CONNECTED) {
        yield put(actions.socketConnected());
      } else if (payload.type === SocketMessageResponseType.DISCONNECTED) {
        yield put(actions.socketDisconnected());
      } else if (payload.type === SocketMessageResponseType.NEW_GAME) {
        yield put(actions.startGame());
        webSocket.send("map");
      } else if (payload.type === SocketMessageResponseType.CELL_OPEN) {
        if (payload.data === "OK") webSocket.send("map");
        else {
          webSocket.send("map");
          yield put(actions.finishGame(false));
        }
      } else if (payload.type === SocketMessageResponseType.MAP_RECEIVED) {
        const cells = parseMapString(payload.data);
        yield put(actions.setCells(cells));
      }
      console.log(payload);
    } catch (err) {
      console.error("socket error:", err);
      socketChannel.close();
    }
  }
}

export default function* rootSaga() {
  yield all([websocketSaga(WS)]);
}

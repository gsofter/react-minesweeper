// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {
  take,
  put,
  call,
  all,
  apply,
  delay,
  takeEvery,
} from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import { createWebSocket, WS } from "../../utils/webSocket";
import * as actions from "../reducers";

enum SocketMessageResponseType {
  NEW_GAME = "new: OK",
  CELL_OPEN = "open: OK",
}
// this function creates an event channel from a given socket
// Setup subscription to incoming `ping` events
function createSocketChannel(ws: WebSocket) {
  // `eventChannel` takes a subscriber function
  // the subscriber function takes an `emit` argument to put messages onto the channel
  return eventChannel((emit) => {
    ws.onopen = (event) => {
      console.log("ws.onopen");
      emit({
        type: "wsopen",
      });
    };

    ws.onmessage = (event) => {
      console.log("onmessage => ", event.data);
      emit({
        type: "onmessage",
        data: event.data,
      });
    };

    ws.onclose = (event) => {
      console.log("websocket closed");
    };

    // the subscriber must return an unsubscribe function
    // this will be invoked when the saga calls `channel.close` method
    const unsubscribe = () => {
      console.log("unsubscribe");
    };

    return unsubscribe;
  });
}

function* websocketSaga(webSocket: WebSocket) {
  console.log("rootSaga");

  const socketChannel = yield call(createSocketChannel, webSocket);

  while (true) {
    try {
      // An error from socketChannel will cause the saga jump to the catch block
      const payload = yield take(socketChannel);
      if (payload.type === "wsopen") {
        yield put(actions.socketConnected());
      } else if (payload.type === "onmessage") {
        if (payload.data === SocketMessageResponseType.NEW_GAME) {
          yield put(actions.startGame());
        } else if (payload.data === SocketMessageResponseType.CELL_OPEN) {
          // yield put(actions.openCell());
        }
      }
      console.log(payload);
    } catch (err) {
      console.error("socket error:", err);
      // socketChannel is still open in catch block
      // if we want end the socketChannel, we need close it explicitly
      // socketChannel.close()
    }
  }
}

export default function* rootSaga() {
  yield all([websocketSaga(WS)]);
}

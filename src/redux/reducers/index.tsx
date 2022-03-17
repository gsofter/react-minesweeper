import { createSlice } from "@reduxjs/toolkit";

export enum GameStatusType {
  NOT_STARTED,
  PLAYING,
  FINISHED,
}

export interface GameState {
  cells: string[][];
  gameStatus: GameStatusType;
  socketReady: boolean;
  hasWon: boolean;
}

const initialState: GameState = {
  cells: [],
  gameStatus: GameStatusType.NOT_STARTED,
  socketReady: false,
  hasWon: false,
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    socketConnected: (state) => {
      state.socketReady = true;
    },
    socketDisconnected: (state) => {
      state.socketReady = true;
      state.cells = [];
    },
    startGame: (state) => {
      state.gameStatus = GameStatusType.PLAYING;
      state.hasWon = false;
    },
    finishGame: (state, { payload }) => {
      state.gameStatus = GameStatusType.FINISHED;
      state.hasWon = payload;
    },
    setCells: (state, { payload }) => {
      state.cells = payload;
    },
  },
});

// Action creators are generate for each case reducer function
export const {
  startGame,
  socketConnected,
  setCells,
  socketDisconnected,
  finishGame,
} = gameSlice.actions;

export default gameSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

export interface GameState {
  cells: string[][];
  gameStarted: boolean;
  socketReady: boolean;
}

const initialState: GameState = {
  cells: [],
  gameStarted: false,
  socketReady: false,
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
      state.gameStarted = true;
    },
    setCells: (state, { payload }) => {
      console.log(payload);
      state.cells = payload;
    },
  },
});

// Action creators are generate for each case reducer function
export const { startGame, socketConnected, setCells, socketDisconnected } =
  gameSlice.actions;

export default gameSlice.reducer;

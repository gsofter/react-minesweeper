import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GameState {
  cells: string[][];
  gameStarted: boolean;
  rowCount: number;
  colCount: number;
  socketReady: boolean;
}

const initialState: GameState = {
  cells: [],
  gameStarted: false,
  rowCount: 10,
  colCount: 10,
  socketReady: false,
};

const generateCells = () => {
  const cells: string[][] = [];

  for (let row = 0; row < 10; row++) {
    cells.push([]);
    for (let col = 0; col < 10; col++) {
      cells[row].push("□");
    }
  }
  return cells;
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    socketConnected: (state) => {
      state.socketReady = true;
    },
    startGame: (state) => {
      console.log("startGame");
      state.gameStarted = true;
      state.cells = generateCells();
    },
  },
});

// Action creators are generate for each case reducer function
export const { startGame, socketConnected } = gameSlice.actions;

export const GAME_START_REQUEST = "GAME_START_REQUEST";
export const CELL_OPEN_REQUEST = "CELL_OPEN_REQUEST";

export default gameSlice.reducer;

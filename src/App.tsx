import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  AppBar,
  CssBaseline,
  Paper,
  Typography,
  Toolbar,
  Container,
} from "@mui/material";

import CellButton from "./components/CellButton";

import { RootState } from "./redux/store";
import AppThemeProvider from "./theme";
import * as actions from "./redux/reducers";

const App: React.FC = () => {
  const cells: string[][] = useSelector((state: RootState) => state.cells);
  const dispatch = useDispatch();

  const cellClicked = (rowId: number, colId: number) => {
    dispatch({
      type: actions.CELL_OPEN_REQUEST,
      payload: {
        rowId,
        colId,
      },
    });
  };

  const renderCells = () => {
    return cells.map((row, rowIndex) => {
      return (
        <div key={`row-${rowIndex}`}>
          {row.map((cell, colIndex) => (
            <CellButton
              key={`cell-${rowIndex}-${colIndex}`}
              cellValue={cell}
              cellClicked={() => cellClicked(rowIndex, colIndex)}
            >
              {" "}
            </CellButton>
          ))}
          <br />
        </div>
      );
    });
  };

  const handleStartGame = () => {
    dispatch({
      type: actions.GAME_START_REQUEST,
    });
  };

  return (
    <AppThemeProvider>
      <CssBaseline />
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: "relative",
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Company name
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="md" sx={{ paddingTop: "50px" }}>
        <Button variant="contained" onClick={() => handleStartGame()}>
          Start game
        </Button>
        <Paper sx={{ mt: "50px", width: "fit-content", height: "100%" }}>
          {renderCells()}
        </Paper>
      </Container>
    </AppThemeProvider>
  );
};

export default App;

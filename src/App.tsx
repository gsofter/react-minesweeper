import React from "react";
import { useSelector } from "react-redux";
import {
  Button,
  AppBar,
  CssBaseline,
  Paper,
  Typography,
  Toolbar,
  Container,
  Alert,
} from "@mui/material";

import CellButton from "./components/CellButton";
import { WS } from "./utils/webSocket";

import { RootState } from "./redux/store";
import AppThemeProvider from "./theme";
import { GameStatusType } from "./redux/reducers";

const App: React.FC = () => {
  const cells: string[][] = useSelector((state: RootState) => state.cells);
  const socketReady: boolean = useSelector(
    (state: RootState) => state.socketReady
  );
  const hasWon: boolean = useSelector((state: RootState) => state.hasWon);
  const gameStatus = useSelector((state: RootState) => state.gameStatus);

  const cellClicked = (rowId: number, colId: number) => {
    if (gameStatus === GameStatusType.PLAYING)
      WS.send(`open ${colId} ${rowId}`);
    else alert("Start new game");
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
    if (socketReady) WS.send("new 1");
    else alert("Websocket Connection Not Ready!");
  };

  const renderAlert = () => {
    if (gameStatus === GameStatusType.FINISHED) {
      return hasWon ? (
        <Alert severity="success"> Congratulations! You won! </Alert>
      ) : (
        <Alert severity="error"> You losed! </Alert>
      );
    }

    return null;
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
            Minesweeper - POC of LiveArt
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="md" sx={{ paddingTop: "50px" }}>
        <Button variant="contained" onClick={() => handleStartGame()}>
          Start game
        </Button>
        {renderAlert()}
        <Paper sx={{ mt: "50px", width: "fit-content", height: "100%" }}>
          {renderCells()}
        </Paper>
      </Container>
    </AppThemeProvider>
  );
};

export default App;

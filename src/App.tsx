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

import { RootState } from "./redux/store";
import AppThemeProvider from "./theme";
import * as actions from "./redux/reducers";

const App: React.FC = () => {
  const cells: string[][] = useSelector((state: RootState) => state.cells);
  const dispatch = useDispatch();

  console.log("cells", cells);

  const handleStartGame = () => {
    console.log("asdf");
    dispatch(actions.startGame());
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
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Button variant="contained" onClick={() => handleStartGame()}>
          {" "}
          Start game{" "}
        </Button>{" "}
      </Container>
    </AppThemeProvider>
  );
};

export default App;

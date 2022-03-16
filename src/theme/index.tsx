import React from "react";
import { createTheme, ThemeProvider } from "@mui/system";

const customTheme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      contrastText: "white",
    },
  },
});

export const AppThemeProvider: React.FC = ({ children }) => {
  return <ThemeProvider theme={customTheme}> {children} </ThemeProvider>;
};

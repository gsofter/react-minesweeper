import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme();

const AppThemeProvider: React.FC = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default AppThemeProvider;

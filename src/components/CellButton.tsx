import React from "react";
import { Button } from "@mui/material";

interface ICellButtonProps {
  cellValue: string;
  cellClicked: () => void;
}

const CellButton: React.FC<ICellButtonProps> = ({ cellValue, cellClicked }) => {
  return (
    <Button
      variant="contained"
      color="success"
      sx={{
        color: "red",
        width: "50px",
        height: "50px",
      }}
      onClick={cellClicked}
    ></Button>
  );
};

export default CellButton;

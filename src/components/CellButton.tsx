import React from "react";
import { Button } from "@mui/material";
import { CELL_NONE, CELL_BOMB } from "../constants";

const mapCallValueToColor = (cellValue: string) => {
  if (cellValue === CELL_NONE) return "default";
  else if (cellValue === "1") return "blue";
  else if (cellValue === "2") return "green";
  else if (cellValue === "3") return "red";
  else if (cellValue === "4") return "purple";
  else if (cellValue === "5") return "maroon";
  else if (cellValue === "6") return "turquoise";
  else if (cellValue === "7") return "black";
  else if (cellValue === "8") return "gray";
  return "default";
};

interface ICellButtonProps {
  cellValue: string;
  cellClicked: () => void;
}

const CellButton: React.FC<ICellButtonProps> = ({ cellValue, cellClicked }) => {
  const buttonType = cellValue === CELL_NONE ? "contained" : "text";

  const renderCellContext = () => {
    if (cellValue === CELL_NONE || cellValue === "0") return null;
    if (cellValue === CELL_BOMB) return "💣";
    if (cellValue >= "1" && cellValue <= "9") return cellValue;
    return null;
  };

  return (
    <Button
      variant={buttonType}
      color="success"
      sx={{
        color: mapCallValueToColor(cellValue),
        width: "50px",
        height: "50px",
        border: `1px solid rgba(0, 0, 0, .1)`,
      }}
      onClick={cellClicked}
    >
      {renderCellContext()}
    </Button>
  );
};

export default CellButton;

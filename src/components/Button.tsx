import React from "react";
import { CellState, CellValue } from "../types";
import { styled } from "@mui/material/styles";

interface ButtonProps {
  col: number;
  onClick(rowParam: number, colParam: number): (...args: any[]) => void;
  onContext(rowParam: number, colParam: number): (...args: any[]) => void;
  red?: boolean;
  row: number;
  state: CellState;
  value: CellValue;
}

const Button: React.FC<ButtonProps> = ({
  col,
  onClick,
  onContext,
  red,
  row,
  state,
  value,
}) => {
  const renderContent = (): React.ReactNode => {
    if (state === CellState.visible) {
      if (value === CellValue.bomb) {
        return (
          <span role="img" aria-label="bomb">
            💣
          </span>
        );
      } else if (value === CellValue.none) {
        return null;
      }

      return value;
    } else if (state === CellState.flagged) {
      return (
        <span role="img" aria-label="flag">
          🚩
        </span>
      );
    }

    return null;
  };

  return (
    <StyledButton
      className={`Button ${
        state === CellState.visible ? "visible" : ""
      } value-${value} ${red ? "red" : ""}`}
      onClick={onClick(row, col)}
      onContextMenu={onContext(row, col)}
    >
      {renderContent()}
    </StyledButton>
  );
};

const StyledButton = styled("div")`
  border-bottom-color: #7b7b7b;
  border-left-color: white;
  border-right-color: #7b7b7b;
  border-style: solid;
  border-top-color: white;
  border-width: 4px;

  &:active {
    border-bottom-color: white;
    border-left-color: #7b7b7b;
    border-right-color: white;
    border-top-color: #7b7b7b;
  }

  align-items: center;
  display: flex;
  font-weight: bold;
  height: 30px;
  justify-content: center;
  width: 30px;

  &.visible {
    border-color: #7b7b7b;
    border-width: 1px;
  }

  &.red {
    background: red;
  }

  span {
    font-size: 12px;
    margin-left: 2px;
  }

  &.value-1 {
    color: blue;
  }
  &.value-2 {
    color: green;
  }
  &.value-3 {
    color: red;
  }
  &.value-4 {
    color: purple;
  }
  &.value-5 {
    color: maroon;
  }
  &.value-6 {
    color: turquoise;
  }
  &.value-7 {
    color: black;
  }
  &.value-8 {
    color: gray;
  }
`;

export default Button;

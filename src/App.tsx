import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Button from "./components/Button";
import NumberDisplay from "./components/NumberDisplay";
import { generateCells, openMultipleCells } from "./utils";
import { Cell, CellState, CellValue, Face } from "./types";
import { MAX_COLS, MAX_ROWS, BOMBS_COUNT } from "./constants";
import { AppThemeProvider } from "./theme";

const App: React.FC = () => {
  const [cells, setCells] = useState<Cell[][]>(generateCells());
  const [face, setFace] = useState<Face>(Face.smile);
  const [time, setTime] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);
  const [bombCounter, setBombCounter] = useState<number>(10);
  const [hasLost, setHasLost] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState<boolean>(false);

  useEffect(() => {
    const handleMouseDown = (): void => {
      setFace(Face.oh);
    };

    const handleMouseUp = (): void => {
      setFace(Face.smile);
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (live && time < 999) {
      const timer = setInterval(() => {
        setTime(time + 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [live, time]);

  useEffect(() => {
    if (hasLost) {
      setLive(false);
      setFace(Face.lost);
    }
  }, [hasLost]);

  useEffect(() => {
    if (hasWon) {
      setLive(false);
      setFace(Face.won);
    }
  }, [hasWon]);

  const handleCellClick = (rowParam: number, colParam: number) => (): void => {
    if (hasLost) {
      alert("You are lost! Restart game again!");
      return;
    }
    let newCells = cells.slice();

    // start the game
    if (!live) {
      let isABomb = newCells[rowParam][colParam].value === CellValue.bomb;
      while (isABomb) {
        newCells = generateCells();
        if (newCells[rowParam][colParam].value !== CellValue.bomb) {
          isABomb = false;
          break;
        }
      }
      setLive(true);
    }

    const currentCell = newCells[rowParam][colParam];

    if ([CellState.flagged, CellState.visible].includes(currentCell.state)) {
      return;
    }

    if (currentCell.value === CellValue.bomb) {
      setHasLost(true);
      newCells[rowParam][colParam].red = true;
      newCells = showAllBombs();
      setCells(newCells);
      return;
    } else if (currentCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam, colParam);
    } else {
      newCells[rowParam][colParam].state = CellState.visible;
    }

    // Check to see if you have won
    let safeOpenCellsExists = false;
    for (let row = 0; row < MAX_ROWS; row++) {
      for (let col = 0; col < MAX_COLS; col++) {
        const currentCell = newCells[row][col];

        if (
          currentCell.value !== CellValue.bomb &&
          currentCell.state === CellState.open
        ) {
          safeOpenCellsExists = true;
          break;
        }
      }
    }

    if (!safeOpenCellsExists) {
      newCells = newCells.map((row) =>
        row.map((cell) => {
          if (cell.value === CellValue.bomb) {
            return {
              ...cell,
              state: CellState.flagged,
            };
          }
          return cell;
        })
      );
      setHasWon(true);
    }

    setCells(newCells);
  };

  const handleCellContext =
    (rowParam: number, colParam: number) =>
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
      e.preventDefault();

      if (!live) {
        return;
      }

      const currentCells = cells.slice();
      const currentCell = cells[rowParam][colParam];

      if (currentCell.state === CellState.visible) {
        return;
      } else if (currentCell.state === CellState.open) {
        currentCells[rowParam][colParam].state = CellState.flagged;
        setCells(currentCells);
        setBombCounter(bombCounter - 1);
      } else if (currentCell.state === CellState.flagged) {
        currentCells[rowParam][colParam].state = CellState.open;
        setCells(currentCells);
        setBombCounter(bombCounter + 1);
      }
    };

  const handleFaceClick = (): void => {
    setLive(false);
    setTime(0);
    setCells(generateCells());
    setBombCounter(BOMBS_COUNT);
    setHasLost(false);
    setHasWon(false);
  };

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <Button
          col={colIndex}
          key={`${rowIndex}-${colIndex}`}
          onClick={handleCellClick}
          onContext={handleCellContext}
          red={cell.red}
          row={rowIndex}
          state={cell.state}
          value={cell.value}
        />
      ))
    );
  };

  const showAllBombs = (): Cell[][] => {
    const currentCells = cells.slice();
    return currentCells.map((row) =>
      row.map((cell) => {
        if (cell.value === CellValue.bomb) {
          return {
            ...cell,
            state: CellState.visible,
          };
        }

        return cell;
      })
    );
  };

  return (
    <AppThemeProvider>
      <div className="App">
        <HeaderContainer className="Header">
          <NumberDisplay value={bombCounter} />
          <FaceContaiiner className="Face" onClick={handleFaceClick}>
            <span role="img" aria-label="face">
              {face}
            </span>
          </FaceContaiiner>
          <NumberDisplay value={time} />
        </HeaderContainer>
        <BodyContainer className="Body">{renderCells()}</BodyContainer>
      </div>
    </AppThemeProvider>
  );
};

const HeaderContainer = styled("div")`
  border-bottom-color: #7b7b7b;
  border-left-color: white;
  border-right-color: #7b7b7b;
  border-style: solid;
  border-top-color: white;
  border-width: 4px;

  align-items: center;
  background: #c0c0c0;
  display: flex;
  justify-content: space-between;
  padding: 10px 12px;
`;

const FaceContaiiner = styled("div")`
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
`;

const BodyContainer = styled("div")`
  border-bottom-color: #7b7b7b;
  border-left-color: white;
  border-right-color: #7b7b7b;
  border-style: solid;
  border-top-color: white;
  border-width: 4px;

  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-template-rows: repeat(9, 1fr);
  margin-top: 16px;
`;
export default App;

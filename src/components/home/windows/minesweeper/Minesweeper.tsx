import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { Cell, CellState } from "./Cell";
import { Display } from "./Display";
const Color = require("color");

export interface IGridCell {
  state: CellState;
  value: number;
  isMine: boolean;
}

const isValidPos = (x: number, y: number, gridSize: number) => {
  if (x < 0 || y < 0 || x > gridSize - 1 || y > gridSize - 1) return false;
  return true;
};

const createNewCoord = (gridSize: number) => {
  return [
    Math.floor(Math.random() * gridSize),
    Math.floor(Math.random() * gridSize),
  ];
};

const placeMines = (
  prevBoard: IGridCell[][],
  x: number,
  y: number,
  totalMineCount: number,
  gridSize: number
) => {
  const board = JSON.parse(JSON.stringify(prevBoard));

  let mineCount = 0;
  while (mineCount < totalMineCount) {
    let coord = createNewCoord(gridSize);

    if (coord[0] !== x && coord[1] !== y && !board[coord[0]][coord[1]].isMine) {
      mineCount++;
      board[coord[0]][coord[1]].isMine = true;
      board[coord[0]][coord[1]].value = -1;
      const _x = coord[0],
        _y = coord[1];
      if (isValidPos(_x - 1, _y, gridSize) && board[_x - 1][_y].value >= 0) {
        board[_x - 1][_y].value += 1;
      }
      if (
        isValidPos(_x - 1, _y + 1, gridSize) &&
        board[_x - 1][_y + 1].value >= 0
      ) {
        board[_x - 1][_y + 1].value += 1;
      }
      if (
        isValidPos(_x - 1, _y - 1, gridSize) &&
        board[_x - 1][_y - 1].value >= 0
      ) {
        board[_x - 1][_y - 1].value += 1;
      }
      if (isValidPos(_x, _y - 1, gridSize) && board[_x][_y - 1].value >= 0) {
        board[_x][_y - 1].value += 1;
      }
      if (isValidPos(_x, _y + 1, gridSize) && board[_x][_y + 1].value >= 0) {
        board[_x][_y + 1].value += 1;
      }
      if (isValidPos(_x + 1, _y, gridSize) && board[_x + 1][_y].value >= 0) {
        board[_x + 1][_y].value += 1;
      }
      if (
        isValidPos(_x + 1, _y + 1, gridSize) &&
        board[_x + 1][_y + 1].value >= 0
      ) {
        board[_x + 1][_y + 1].value += 1;
      }
      if (
        isValidPos(_x + 1, _y - 1, gridSize) &&
        board[_x + 1][_y - 1].value >= 0
      ) {
        board[_x + 1][_y - 1].value += 1;
      }
    }
  }

  return board;
};

const resetBoard = (gridSize: number): IGridCell[][] => {
  const board: IGridCell[][] = new Array<IGridCell[]>(gridSize);

  for (let i = 0; i < gridSize; ++i) {
    board[i] = new Array<IGridCell>(gridSize);
    for (let j = 0; j < gridSize; ++j) {
      board[i][j] = {
        state: CellState.CLOSED,
        value: 0,
        isMine: false,
      };
    }
  }

  return board;
};

const revealBoard = (
  prevBoard: IGridCell[][],
  x: number,
  y: number,
  gridSize: number
): { newBoard: IGridCell[][]; isGameOver: boolean } => {
  const newBoard: IGridCell[][] = JSON.parse(JSON.stringify(prevBoard));
  if (newBoard[x][y].isMine) {
    // TODO: Show all mines
    return { newBoard, isGameOver: true };
  }

  if (newBoard[x][y].value !== 0) {
    newBoard[x][y].state = CellState.OPEN;
    return { newBoard, isGameOver: false };
  }

  // DFS
  const stack = [[x, y]];
  while (stack.length > 0) {
    const [_x, _y] = stack.pop() as number[];
    newBoard[_x][_y].state = CellState.OPEN;
    if (newBoard[_x][_y].value > 0) continue;

    if (
      isValidPos(_x - 1, _y, gridSize) &&
      newBoard[_x - 1][_y].state === CellState.CLOSED
    ) {
      stack.push([_x - 1, _y]);
      newBoard[_x - 1][_y].state = CellState.OPEN;
    }
    if (
      isValidPos(_x - 1, _y + 1, gridSize) &&
      newBoard[_x - 1][_y + 1].state === CellState.CLOSED
    ) {
      stack.push([_x - 1, _y + 1]);
      newBoard[_x - 1][_y + 1].state = CellState.OPEN;
    }
    if (
      isValidPos(_x - 1, _y - 1, gridSize) &&
      newBoard[_x - 1][_y - 1].state === CellState.CLOSED
    ) {
      stack.push([_x - 1, _y - 1]);
      newBoard[_x - 1][_y - 1].state = CellState.OPEN;
    }
    if (
      isValidPos(_x, _y - 1, gridSize) &&
      newBoard[_x][_y - 1].state === CellState.CLOSED
    ) {
      stack.push([_x, _y - 1]);
      newBoard[_x][_y].state = CellState.OPEN;
    }
    if (
      isValidPos(_x, _y + 1, gridSize) &&
      newBoard[_x][_y + 1].state === CellState.CLOSED
    ) {
      stack.push([_x, _y + 1]);
      newBoard[_x][_y + 1].state = CellState.OPEN;
    }
    if (
      isValidPos(_x + 1, _y, gridSize) &&
      newBoard[_x + 1][_y].state === CellState.CLOSED
    ) {
      stack.push([_x + 1, _y]);
      newBoard[_x + 1][_y].state = CellState.OPEN;
    }
    if (
      isValidPos(_x + 1, _y + 1, gridSize) &&
      newBoard[_x + 1][_y + 1].state === CellState.CLOSED
    ) {
      stack.push([_x + 1, _y + 1]);
      newBoard[_x + 1][_y + 1].state = CellState.OPEN;
    }
    if (
      isValidPos(_x + 1, _y - 1, gridSize) &&
      newBoard[_x + 1][_y - 1].state === CellState.CLOSED
    ) {
      stack.push([_x + 1, _y - 1]);
      newBoard[_x + 1][_y - 1].state = CellState.OPEN;
    }
  }
  return { newBoard, isGameOver: false };
};

const checkWin = (
  board: IGridCell[][],
  totalMineCount: number,
  gridSize: number
): boolean => {
  let flaggedMineNum = 0,
    openCellNum = 0;
  for (let i = 0; i < gridSize; ++i) {
    for (let j = 0; j < gridSize; ++j) {
      if (board[i][j].state === CellState.OPEN) openCellNum++;
      if (board[i][j].isMine && board[i][j].state === CellState.FLAGGED)
        flaggedMineNum++;
    }
  }

  if (flaggedMineNum === totalMineCount) return true;
  if (openCellNum === gridSize * gridSize - totalMineCount) return true;

  return false;
};

export interface IMinesweeperProps {
  mineCount?: number;
  gridSize?: number;
}

export const Minesweeper = ({
  mineCount = 10,
  gridSize = 30,
}: IMinesweeperProps) => {
  const [mineGrid, setMineGrid] = useState<IGridCell[][]>(resetBoard(gridSize));
  const [gameOver, setGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [freshBoard, setFreshBoard] = useState(true);
  const [flaggedNum, setFlaggedNum] = useState(0);
  const [time, setTime] = useState(0);
  const timerId = useRef<NodeJS.Timer>();
  const mineNum = useRef(mineCount);
  const gridSizeRef = useRef(gridSize);

  useEffect(() => {
    console.log(mineNum.current, mineCount);
    if (mineNum.current !== mineCount || gridSize !== gridSizeRef.current) {
      mineNum.current = mineCount;
      gridSizeRef.current = gridSize;
      resetGame();
    }

    return () => timerId.current && clearInterval(timerId.current);
  }, [mineCount, gridSize]);

  const resetGame = () => {
    setMineGrid(resetBoard(gridSize));
    setGameOver(false);
    setFreshBoard(true);
    setTime(0);
    setIsWin(false);
    setFlaggedNum(0);

    if (timerId.current) {
      clearInterval(timerId.current);
    }
  };

  const handleOnClick = (x: number, y: number, isFreshBoard = false) => {
    if (isWin) return;
    if (mineGrid[x][y].state !== CellState.CLOSED) return;

    setMineGrid((prevMineGrid) => {
      if (isFreshBoard) {
        timerId.current = setInterval(() => {
          setTime((prevTime) => prevTime + 1);
        }, 1000);
        const { newBoard } = revealBoard(
          placeMines(prevMineGrid, x, y, mineNum.current, gridSizeRef.current),
          x,
          y,
          gridSizeRef.current
        );

        if (checkWin(newBoard, mineNum.current, gridSizeRef.current)) {
          clearInterval(timerId.current);
          delete timerId.current;
          setIsWin(true);
        }

        return newBoard;
      }

      const { newBoard, isGameOver } = revealBoard(
        prevMineGrid,
        x,
        y,
        gridSizeRef.current
      );

      if (isGameOver) {
        clearInterval(timerId.current);
        delete timerId.current;
        setGameOver(true);
      }

      if (checkWin(newBoard, mineNum.current, gridSizeRef.current)) {
        clearInterval(timerId.current);
        delete timerId.current;
        setIsWin(true);
      }

      return newBoard;
    });
  };

  const handleOnContextMenu = (x: number, y: number) => {
    if (isWin) return;
    if (mineGrid[x][y].state === CellState.OPEN) return;

    setMineGrid((prevMineGrid) => {
      const newBoard: IGridCell[][] = JSON.parse(JSON.stringify(prevMineGrid));
      if (newBoard[x][y].state === CellState.FLAGGED) {
        setFlaggedNum((prevFlaggedNum) => prevFlaggedNum - 1);
        newBoard[x][y].state = CellState.CLOSED;
      } else {
        setFlaggedNum((prevFlaggedNum) => prevFlaggedNum + 1);
        newBoard[x][y].state = CellState.FLAGGED;
      }

      if (checkWin(newBoard, mineNum.current, gridSizeRef.current)) {
        clearInterval(timerId.current);
        delete timerId.current;
        setIsWin(true);
      }

      return newBoard;
    });
  };

  const board: ReactNode[] = useMemo(() => {
    const tempBoard: ReactNode[] = [];
    for (let x = 0; x < gridSizeRef.current; ++x) {
      for (let y = 0; y < gridSizeRef.current; ++y) {
        const mine = mineGrid[x][y];

        tempBoard.push(
          <Cell
            key={`cell_${x}_${y}`}
            x={x}
            y={y}
            {...mine}
            onClick={() => {
              handleOnClick(x, y, freshBoard);

              if (freshBoard) {
                setFreshBoard(false);
              }
            }}
            onContextMenu={() => handleOnContextMenu(x, y)}
          />
        );
      }
    }
    return tempBoard;
  }, [mineGrid, freshBoard]);

  let face = "😊";
  if (isWin) face = "🥳";
  else if (gameOver) face = "😭";

  return (
    <Minesweeper.Container>
      <Minesweeper.Header>
        <Display content={mineNum.current - flaggedNum} />
        <Minesweeper.ResetBtn onClick={resetGame}>
          <span>{face}</span>
        </Minesweeper.ResetBtn>
        <Display content={time} />
      </Minesweeper.Header>
      <Minesweeper.GridContainer
        onContextMenu={(e) => {
          e.preventDefault();
        }}
        $gridSize={gridSizeRef.current}
      >
        {board}
        {gameOver && (
          <Minesweeper.Overlay onClick={resetGame}>
            <h1>Game Over</h1>
          </Minesweeper.Overlay>
        )}
      </Minesweeper.GridContainer>
    </Minesweeper.Container>
  );
};

Minesweeper.Container = styled.div``;

Minesweeper.Header = styled.div`
  width: calc(100% - 20px);
  padding: 10px;
  background-color: ${({ theme }) => theme.background3};

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

Minesweeper.ResetBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 2px;
  aspect-ratio: 1 / 1;
  font-size: 1.75em;
  background-color: ${({ theme }) => theme.background};

  span {
    display: inline-block;
    margin-top: -0.2em;
  }

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) =>
      Color(theme.background).lighten(0.2).hsl().string()};
  }
`;

Minesweeper.GridContainer = styled.div<{ $gridSize: number }>`
  color: ${({ theme }) => theme.text};
  padding: 3px;

  position: relative;
  display: grid;
  grid-template-columns: repeat(${({ $gridSize }) => $gridSize}, 1fr);
  grid-template-rows: repeat(${({ $gridSize }) => $gridSize}, 1fr);
  gap: 3px;
  overflow: hidden;
`;

Minesweeper.Overlay = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.7);
  width: 100%;
  height: 100%;

  h1 {
    font-size: 2rem;
  }
`;

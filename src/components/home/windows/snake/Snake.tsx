import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

enum Directions {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

const isOnTop = (coord1: number[], coord2: number[]) => {
  return coord1[0] === coord2[0] && coord1[1] === coord2[1];
};

const moveSnake = (
  snakeCoords: number[][],
  foodCoords: number[][],
  direction: Directions,
  gridSize: number
) => {
  let prevSnakeCoord = [...snakeCoords[0]];

  //Move head
  switch (direction) {
    case Directions.UP:
      snakeCoords[0][1] -= 1;
      if (snakeCoords[0][1] < 0) snakeCoords[0][1] = gridSize - 1;
      break;
    case Directions.DOWN:
      snakeCoords[0][1] += 1;
      if (snakeCoords[0][1] >= gridSize) snakeCoords[0][1] = 0;
      break;
    case Directions.RIGHT:
      snakeCoords[0][0] += 1;
      if (snakeCoords[0][0] >= gridSize) snakeCoords[0][0] = 0;
      break;
    case Directions.LEFT:
      snakeCoords[0][0] -= 1;
      if (snakeCoords[0][0] < 0) snakeCoords[0][0] = gridSize - 1;
      break;
  }

  let temp;
  for (let i = 1; i < snakeCoords.length; ++i) {
    temp = [...snakeCoords[i]];
    snakeCoords[i] = prevSnakeCoord;
    prevSnakeCoord = temp;
  }

  // Was food eaten?
  for (let i = 0; i < foodCoords.length; ++i) {
    if (isOnTop(foodCoords[i], snakeCoords[0])) {
      foodCoords[i] = [
        Math.floor(Math.random() * gridSize),
        Math.floor(Math.random() * gridSize),
      ];

      snakeCoords.push([...foodCoords[i]]);
    }
  }

  return [...snakeCoords];
};

export interface ISnakeProps {
  gridSize?: number;
}

export const Snake = ({ gridSize = 20 }: ISnakeProps) => {
  const [snakeCoords, setSnakeCoords] = useState<number[][]>([
    [Math.floor(gridSize / 2) + 1, Math.floor(gridSize / 2)],
    [Math.floor(gridSize / 2), Math.floor(gridSize / 2)],
  ]);
  const foodCoords = useRef([
    [
      Math.floor(Math.random() * gridSize),
      Math.floor(Math.random() * gridSize),
    ],
  ]);
  const [gameActive, setGameActive] = useState(false);
  const dirRef = useRef<Directions>(Directions.RIGHT);
  const gameOver = useRef(false);
  const gridSizeRef = useRef(gridSize);

  const resetGame = useCallback(
    (gameActive = true) => {
      setSnakeCoords([
        [Math.floor(gridSize / 2) + 1, Math.floor(gridSize / 2)],
        [Math.floor(gridSize / 2), Math.floor(gridSize / 2)],
      ]);
      foodCoords.current = [
        [
          Math.floor(Math.random() * gridSize),
          Math.floor(Math.random() * gridSize),
        ],
      ];
      setGameActive(gameActive);
    },
    [setSnakeCoords, setGameActive, foodCoords, gridSize]
  );

  if (gridSize !== gridSizeRef.current) {
    gridSizeRef.current = gridSize;
    resetGame(gameActive);
  }

  useEffect(() => {
    for (let i = 1; i < snakeCoords.length; ++i) {
      if (isOnTop(snakeCoords[i], snakeCoords[0])) {
        gameOver.current = true;
        setGameActive(false);
      }
    }
  }, [snakeCoords]);

  useEffect(() => {
    if (gameActive) {
      const intervalId = setInterval(() => {
        setSnakeCoords((prevSnakeCoords) =>
          moveSnake(
            prevSnakeCoords,
            foodCoords.current,
            dirRef.current,
            gridSize
          )
        );
      }, 150);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [gameActive, gridSize]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      switch (e.key) {
        case "ArrowDown":
          if (dirRef.current !== Directions.UP)
            dirRef.current = Directions.DOWN;
          break;
        case "ArrowUp":
          if (dirRef.current !== Directions.DOWN)
            dirRef.current = Directions.UP;
          break;
        case "ArrowLeft":
          if (dirRef.current !== Directions.RIGHT)
            dirRef.current = Directions.LEFT;
          break;
        case "ArrowRight":
          if (dirRef.current !== Directions.LEFT)
            dirRef.current = Directions.RIGHT;
          break;
        case "Escape":
          if (gameOver.current) {
            resetGame();
            gameOver.current = false;
          } else {
            setGameActive((prevGameActive) => !prevGameActive);
          }
          break;
      }
    },
    [resetGame]
  );

  const snakePieces = snakeCoords.map(([x, y], idx) => (
    <div
      key={"snake_" + idx}
      style={{
        gridArea: `${y + 1} / ${x + 1} / ${y + 2} / ${x + 2}`,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
      }}
    />
  ));

  const foodPieces = foodCoords.current.map(([x, y], idx) => (
    <div
      key={"food_" + idx}
      style={{
        gridArea: `${y + 1} / ${x + 1} / ${y + 2} / ${x + 2}`,
        backgroundColor: "rgba(255, 50, 50)",
      }}
    />
  ));

  return (
    <Snake.Container
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      $gridSize={gridSize}
    >
      {(!gameActive || gameOver.current) && (
        <Snake.Overlay>
          {gameOver.current ? (
            <>
              <h1>Game Over</h1>
              <h2>
                Press <kbd>esc</kbd> to restart
              </h2>
            </>
          ) : (
            <>
              <h1>PAUSED</h1>
              <h2>
                Press <kbd>esc</kbd> to resume
              </h2>
            </>
          )}
        </Snake.Overlay>
      )}
      {snakePieces}
      {foodPieces}
    </Snake.Container>
  );
};

Snake.Container = styled.div<{ $gridSize: number }>`
  position: relative;
  background-color: ${({ theme }) => theme.background};

  width: 500px;
  height: 500px;

  display: grid;
  grid-template-columns: repeat(${({ $gridSize }) => $gridSize}, 1fr);
  grid-template-rows: repeat(${({ $gridSize }) => $gridSize}, 1fr);
  gap: 3px;
  overflow: hidden;
`;

Snake.Overlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;

  background-color: rgba(0, 0, 0, 0.5);
  color: white;

  h1 {
    font-size: 3rem;
  }
`;

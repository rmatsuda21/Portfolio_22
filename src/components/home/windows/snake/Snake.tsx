import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

const GRID_SIZE = 25;
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
  direction: Directions
) => {
  let prevSnakeCoord = [...snakeCoords[0]];

  //Move head
  switch (direction) {
    case Directions.UP:
      snakeCoords[0][1] -= 1;
      if (snakeCoords[0][1] < 0) snakeCoords[0][1] = GRID_SIZE - 1;
      break;
    case Directions.DOWN:
      snakeCoords[0][1] += 1;
      if (snakeCoords[0][1] >= GRID_SIZE) snakeCoords[0][1] = 0;
      break;
    case Directions.RIGHT:
      snakeCoords[0][0] += 1;
      if (snakeCoords[0][0] >= GRID_SIZE) snakeCoords[0][0] = 0;
      break;
    case Directions.LEFT:
      snakeCoords[0][0] -= 1;
      if (snakeCoords[0][0] < 0) snakeCoords[0][0] = GRID_SIZE - 1;
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
        Math.floor(Math.random() * GRID_SIZE),
        Math.floor(Math.random() * GRID_SIZE),
      ];

      snakeCoords.push([...foodCoords[i]]);
    }
  }

  return [...snakeCoords];
};

export const Snake = () => {
  const [snakeCoords, setSnakeCoords] = useState<number[][]>([
    [Math.floor(GRID_SIZE / 2) + 1, Math.floor(GRID_SIZE / 2)],
    [Math.floor(GRID_SIZE / 2), Math.floor(GRID_SIZE / 2)],
  ]);
  const foodCoords = useRef([
    [
      Math.floor(Math.random() * GRID_SIZE),
      Math.floor(Math.random() * GRID_SIZE),
    ],
  ]);

  const [gameActive, setGameActive] = useState(false);
  const dirRef = useRef<Directions>(Directions.RIGHT);
  const gameOver = useRef(false);

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
          moveSnake(prevSnakeCoords, foodCoords.current, dirRef.current)
        );
      }, 150);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [gameActive]);

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
            setSnakeCoords([
              [Math.floor(GRID_SIZE / 2) + 1, Math.floor(GRID_SIZE / 2)],
              [Math.floor(GRID_SIZE / 2), Math.floor(GRID_SIZE / 2)],
            ]);
            gameOver.current = false;
            setGameActive(true);
          } else {
            setGameActive((prevGameActive) => !prevGameActive);
          }
          break;
      }
    },
    []
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
    <Snake.Container tabIndex={-1} onKeyDown={handleKeyDown}>
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

Snake.Container = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.background};

  width: 500px;
  height: 500px;

  display: grid;
  grid-template-columns: repeat(${GRID_SIZE}, 1fr);
  grid-template-rows: repeat(${GRID_SIZE}, 1fr);
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
  gap: 0.5rem;

  background-color: rgba(0, 0, 0, 0.5);
  color: white;

  h1 {
    font-size: 3rem;
  }
`;

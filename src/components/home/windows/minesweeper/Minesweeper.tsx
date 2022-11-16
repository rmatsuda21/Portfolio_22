import { useState } from "react";
import styled from "styled-components";

export const Minesweeper = () => {
  // const [mineCoords, setMineCoords] = useState<number[][]>();

  return <Minesweeper.Container>Minesweeper</Minesweeper.Container>;
};

Minesweeper.Container = styled.div`
  width: 500px;
  height: 500px;

  color: ${({ theme }) => theme.text};
`;

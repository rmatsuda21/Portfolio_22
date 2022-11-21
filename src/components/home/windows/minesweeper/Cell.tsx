import { IGridCell } from "./Minesweeper";
import styled from "styled-components";

interface ICellProps extends IGridCell {
  x: number;
  y: number;
  onClick: () => void;
  onContextMenu: () => void;
}

export enum CellState {
  OPEN,
  CLOSED,
  FLAGGED,
}

export const Cell = ({
  x,
  y,
  value,
  state,
  onClick,
  onContextMenu,
}: ICellProps) => {
  const style: React.CSSProperties = {
    width: "1em",
    height: "1em",
    fontSize: "8px",
    padding: "4px",
    gridArea: `${x + 1} / ${y + 1} / ${x + 2} / ${y + 2}`,
  };

  return (
    <Cell.Container
      onClick={onClick}
      onContextMenu={onContextMenu}
      style={style}
      $state={state}
    >
      {value > 0 && value}
    </Cell.Container>
  );
};

Cell.Container = styled.div<{ $state: CellState }>`
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */

  ${({ $state, theme }) => {
    switch ($state) {
      case CellState.CLOSED:
        return `
          cursor: pointer;
          color: transparent;
          background-color: ${theme.background3};

          &:hover {
            filter: brightness(1.25);
          }
        `;
      case CellState.OPEN:
        return `
          cursor: default;
          background-color: ${theme.background2};
          color: ${theme.text}
        `;
      case CellState.FLAGGED:
        return `
          color: transparent;
          background-color: blue;
          cursor: pointer;
        `;
      default:
        return;
    }
  }}
`;

import { ReactNode } from "react";
import Draggable from "react-draggable";
import styled from "styled-components";

export interface IWindowProps {
  title: string;
  children?: ReactNode;
  $zIndex: number;
  reorderWindows: () => void;
  closeWindows: () => void;
}

export const Window = ({
  title,
  $zIndex,
  reorderWindows,
  closeWindows,
  children,
}: IWindowProps) => {
  return (
    <Draggable handle=".windowHandle">
      <Window.DraggableContainer
        $zIndex={$zIndex}
        onPointerDown={reorderWindows}
      >
        <Window.DraggableContainerHeader className="windowHandle">
          <Window.Title>{title}</Window.Title>
          <Window.CloseBtn onClick={closeWindows}>X</Window.CloseBtn>
        </Window.DraggableContainerHeader>
        <Window.Content>{children}</Window.Content>
      </Window.DraggableContainer>
    </Draggable>
  );
};

Window.DraggableContainer = styled.div<{ $zIndex: number }>`
  position: absolute;
  z-index: ${({ $zIndex }) => $zIndex};

  width: min-content;
  max-width: min-content;
  outline: ${({ theme }) => theme.border};

  background-color: white;
  color: black;
`;

Window.DraggableContainerHeader = styled.div`
  width: 100%;
  height: 30px;

  background-color: ${({ theme }) => theme.background2};
  color: ${({ theme }) => theme.text};

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

Window.Title = styled.h1`
  margin-inline: 5px;
  text-transform: uppercase;
  overflow: hidden;
`;

Window.CloseBtn = styled.div`
  height: 100%;
  aspect-ratio: 1 / 1;
  background-color: rgba(255, 20, 20, 0.6);

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
    background-color: rgba(255, 20, 20, 0.8);
  }
`;

Window.Content = styled.div`
  min-width: 100px;
  min-height: 100px;
  background-color: ${({ theme }) => theme.background};
`;

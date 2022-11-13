import { ReactNode } from "react";
import Draggable from "react-draggable";
import styled from "styled-components";

export interface IWindowProps {
  title: string;
  children?: ReactNode;
  $zIndex: number;
  reorderWindows: () => void;
}

export const Window = ({
  title,
  $zIndex,
  reorderWindows,
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
  padding-block: 10px;

  background-color: ${({ theme }) => theme.background2};
  color: ${({ theme }) => theme.text};
`;

Window.Title = styled.h1`
  margin-inline: 5px;
  text-transform: uppercase;
  overflow: hidden;
`;

Window.Content = styled.div`
  min-width: 100px;
  min-height: 100px;
  background-color: ${({ theme }) => theme.background};
`;

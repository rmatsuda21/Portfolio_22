import { ReactNode, useState } from "react";
import Draggable from "react-draggable";
import styled from "styled-components";
import { WindowMenu } from "./WindowMenu";
const Color = require("color");

export interface IWindowProps {
  title: string;
  children?: ReactNode;
  $zIndex: number;
  reorderWindows: () => void;
  closeWindows: () => void;
  Component: React.FC;
  props: Object;
}

export const Window = ({
  title,
  $zIndex,
  reorderWindows,
  closeWindows,
  Component,
  props,
}: IWindowProps) => {
  const [componentProps, setComponentProps] = useState(props);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setMenuOpen((prevMenuOpen) => !prevMenuOpen);
  };

  return (
    <Draggable handle=".windowHandle">
      <Window.DraggableContainer
        $zIndex={$zIndex}
        onPointerDown={reorderWindows}
      >
        <Window.DraggableContainerHeader className="windowHandle">
          <Window.Title onClick={handleMenuClick}>{title}</Window.Title>
          <Window.CloseBtn onClick={closeWindows}>X</Window.CloseBtn>
          {menuOpen && (
            <WindowMenu
              componentProps={componentProps}
              setComponentProps={setComponentProps}
            />
          )}
        </Window.DraggableContainerHeader>
        <Window.Content>{Component({ ...componentProps })}</Window.Content>
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

  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

Window.Title = styled.div`
  margin-inline: 5px;
  text-transform: uppercase;
  overflow: hidden;

  display: flex;
  align-items: center;
  height: 100%;

  &:hover {
    background-color: ${({ theme }) =>
      Color(theme.background2).lighten(0.3).hsl().string()};
    cursor: pointer;
  }
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

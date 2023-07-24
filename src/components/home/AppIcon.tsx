import { useRef } from "react";
import Draggable from "react-draggable";
import styled from "styled-components";

interface IAppIcon {
  iconSrc: string;
  name: string;
  onClick: () => void;
}

export const AppIcon = ({ iconSrc, name, onClick }: IAppIcon) => {
  const isDragging = useRef(false);

  return (
    <Draggable
      onDrag={() => {
        isDragging.current = true;
      }}
      onStop={() => {
        if (!isDragging.current) onClick();
        isDragging.current = false;
      }}
    >
      <AppIcon.Icon>
        {iconSrc.length > 2 ? (
          <img alt="app icon" src={iconSrc} width={60} height={60} />
        ) : (
          <span>{iconSrc}</span>
        )}
        <h1>{name}</h1>
      </AppIcon.Icon>
    </Draggable>
  );
};

AppIcon.Icon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;

  width: min-content;
  padding: 5px;

  cursor: pointer;
  h1 {
    font-size: 10px;
    color: ${({ theme }) => theme.text};
    text-align: center;
  }

  img {
    pointer-events: none;
  }

  span {
    font-size: 50px;
    line-height: 64px;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

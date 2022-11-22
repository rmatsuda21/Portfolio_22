import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";
import { AppIcon } from "../components/home/AppIcon";
import { Footer } from "../components/home/footer/Footer";
import { ISnakeProps, Snake } from "../components/home/windows/snake/Snake";
import { Window } from "../components/home/windows/Window";
import snakeLogo from "../images/snake.png";
import minesweeperLogo from "../images/mine.png";
import {
  IMinesweeperProps,
  Minesweeper,
} from "../components/home/windows/minesweeper/Minesweeper";
import { ThemeNames } from "../styles/theme";
import { RChat } from "../components/home/windows/rchat/RChat";

interface IWindowList {
  Component: React.FC;
  props?: Object;
  title: string;
  zIndex: number;
  index: number;
}

interface IHomeProps {
  setSelectedTheme: React.Dispatch<React.SetStateAction<ThemeNames>>;
}

export const Home = ({ setSelectedTheme }: IHomeProps) => {
  const [windowList, setWindowList] = useState<IWindowList[]>([
    {
      Component: () => <RChat />,
      title: "Snake",
      zIndex: 1,
      index: 0,
    },
  ]);
  const maxId = useRef(windowList.length);

  const addWindow = useCallback(
    (Component: React.FC, props = {}) => {
      maxId.current += 1;
      setWindowList((prevWindowList) => [
        ...prevWindowList,
        {
          Component,
          props,
          title: "Test " + maxId.current,
          zIndex: prevWindowList.length + 1,
          index: maxId.current,
        },
      ]);
    },
    [setWindowList]
  );

  const reorderWindows = useCallback(
    (index: number) => {
      const currWindow = windowList.find((window) => window.index === index);
      const windowZIndex = currWindow ? currWindow.zIndex : 0;

      setWindowList((prevWindowList) =>
        prevWindowList.map((window) => {
          if (window.index === index)
            return { ...window, zIndex: prevWindowList.length };
          if (window.zIndex > windowZIndex)
            return { ...window, zIndex: window.zIndex - 1 };
          return window;
        })
      );
    },
    [setWindowList, windowList]
  );

  const closeWindows = useCallback((index: number) => {
    setWindowList((prevWindowList) =>
      prevWindowList.filter((window) => window.index !== index)
    );
  }, []);

  return (
    <Home.Wrapper>
      <Home.AppIconWrapper>
        <AppIcon
          iconSrc={snakeLogo}
          name="Snake"
          onClick={() =>
            addWindow((props: ISnakeProps) => <Snake {...props} />, {
              gridSize: 20,
            })
          }
        />
        <AppIcon
          iconSrc={minesweeperLogo}
          name="Mine Sweeper"
          onClick={() =>
            addWindow(
              (props: IMinesweeperProps) => <Minesweeper {...props} />,
              {
                mineCount: 10,
                gridSize: 20,
              }
            )
          }
        />
      </Home.AppIconWrapper>
      {windowList.map(({ Component, props, title, zIndex, index }) => (
        <Window
          key={"window_" + index}
          title={title}
          $zIndex={zIndex}
          reorderWindows={() => reorderWindows(index)}
          closeWindows={() => closeWindows(index)}
          Component={Component}
          props={props as Object}
        />
      ))}
      <Footer setSelectedTheme={setSelectedTheme} />
    </Home.Wrapper>
  );
};

Home.Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  background-color: ${({ theme }) => theme.background};

  &::before {
    content: " ";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: linear-gradient(
        rgba(18, 16, 16, 0) 50%,
        rgba(0, 0, 0, 0.25) 50%
      ),
      linear-gradient(
        90deg,
        rgba(255, 0, 0, 0.06),
        rgba(0, 255, 0, 0.02),
        rgba(0, 0, 255, 0.06)
      );
    z-index: 100;
    background-size: 100% 2px, 3px 100%;
    pointer-events: none;
  }
`;

Home.AppIconWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 10px;
  gap: 10px;
`;

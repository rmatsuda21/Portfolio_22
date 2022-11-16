import { ReactNode, useCallback, useRef, useState } from "react";
import styled from "styled-components";
import { AppIcon } from "../components/home/AppIcon";
import { Footer } from "../components/home/footer/Footer";
import { Snake } from "../components/home/windows/snake/Snake";
import { Test } from "../components/home/windows/Test";
import { Window } from "../components/home/windows/Window";
import snakeLogo from "../images/snake.png";
import minesweeperLogo from "../images/mine.png";
import { Minesweeper } from "../components/home/windows/minesweeper/Minesweeper";

interface IWindowList {
  component: ReactNode;
  title: string;
  zIndex: number;
  index: number;
}

export const Home = () => {
  const [windowList, setWindowList] = useState<IWindowList[]>([
    // {
    //   component: <Snake />,
    //   title: "Snake",
    //   zIndex: 1,
    //   index: 0,
    // },
  ]);
  const maxId = useRef(windowList.length);

  const addWindow = useCallback(
    (component: ReactNode) => {
      maxId.current += 1;
      setWindowList((prevWindowList) => [
        ...prevWindowList,
        {
          component,
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
      <button onClick={() => addWindow(<Test />)}>Click Me!</button>
      <button onClick={() => reorderWindows(1)}>Clickkk MEEEE</button>
      <Home.AppIconWrapper>
        <AppIcon
          iconSrc={snakeLogo}
          name="Snake"
          onClick={() => addWindow(<Snake />)}
        />
        <AppIcon
          iconSrc={minesweeperLogo}
          name="Mine Sweeper"
          onClick={() => addWindow(<Minesweeper />)}
        />
      </Home.AppIconWrapper>
      {windowList.map(({ component, title, zIndex, index }) => (
        <Window
          key={"window_" + index}
          title={title}
          $zIndex={zIndex}
          reorderWindows={() => reorderWindows(index)}
          closeWindows={() => closeWindows(index)}
        >
          {component}
        </Window>
      ))}
      <Footer />
    </Home.Wrapper>
  );
};

Home.Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  background-color: ${({ theme }) => theme.background};
`;

Home.AppIconWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 10px;
  gap: 10px;
`;

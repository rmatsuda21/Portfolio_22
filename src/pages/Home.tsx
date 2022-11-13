import { ReactNode, useState } from "react";
import styled from "styled-components";
import { Footer } from "../components/home/footer/Footer";
import { Test } from "../components/home/windows/Test";
import { Window } from "../components/home/windows/Window";

interface IWindowList {
  component: ReactNode;
  title: string;
  zIndex: number;
  index: number;
}

export const Home = () => {
  const [windowList, setWindowList] = useState<IWindowList[]>([]);

  const addWindow = (component: ReactNode) => {
    setWindowList((prevWindowList) => [
      ...prevWindowList,
      {
        component,
        title: "Test",
        zIndex: prevWindowList.length + 1,
        index: prevWindowList.length + 1,
      },
    ]);
  };

  const reorderWindows = (index: number) => {
    const windowZIndex = windowList[index - 1].zIndex;

    setWindowList((prevWindowList) =>
      prevWindowList.map((window) => {
        if (window.index === index)
          return { ...window, zIndex: prevWindowList.length };
        if (window.zIndex > windowZIndex)
          return { ...window, zIndex: window.zIndex - 1 };
        return window;
      })
    );
  };

  return (
    <Home.Wrapper>
      <button onClick={() => addWindow(<Test />)}>Click Me!</button>
      <button onClick={() => reorderWindows(1)}>Clickkk MEEEE</button>
      {windowList.map(({ component, title, zIndex, index }, idx) => (
        <Window
          key={idx}
          title={title}
          $zIndex={zIndex}
          reorderWindows={() => reorderWindows(index)}
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

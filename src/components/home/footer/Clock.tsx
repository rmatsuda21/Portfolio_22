import dayjs from "dayjs";
import { useEffect, useState } from "react";
import styled from "styled-components";

export const Clock = () => {
  const [currentTime, setCurrentTime] = useState(dayjs());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return <Clock.Clock>{currentTime.format("HH:mm:ss")}</Clock.Clock>;
};

Clock.Clock = styled.h1`
  color: ${({ theme }) => theme.text};
`;

import { useEffect, useRef, useState } from "react";
import styled, { useTheme } from "styled-components";
import Color from "color";

import { Footer } from "../components/home/footer/Footer";
import { ThemeNames } from "../styles/theme";

interface ILanguage {
  name: string;
  noLazyMode: boolean;
  orderedByFrequency: true;
  words: string[];
}

const englishData: ILanguage = require("../languages/english.json");

type CorrectType = 0 | 1 | 2 | -1;
type CorrectClass = "active" | "correct" | "incorrect" | "";

type CorrectMap = {
  [key in CorrectType]: CorrectClass;
};

const CORRECT_MAP: CorrectMap = {
  0: "active",
  1: "correct",
  2: "incorrect",
  [-1]: "",
};

interface Map {
  word: string;
  correct: CorrectType;
}

const isWordCorrect = (currWord: string, answer: string): boolean => {
  if (currWord.length > answer.length) return false;

  return answer.substring(0, currWord.length) === currWord;
};

const createNewWordList = (listLength = 100) => {
  const words: Map[] = [];
  for (let i = 0; i < listLength; ++i) {
    const randWord = Math.floor(Math.random() * englishData.words.length);
    words.push({ word: englishData.words[randWord], correct: -1 });
  }
  return words;
};

const calculateGrossWPM = (wordMap: Map[], time: number) => {
  if (wordMap === undefined || time <= 0) return 0;

  const allTypedEntries = wordMap.reduce(
    (acc, curr) => acc + curr.word.length,
    0
  );
  const timeInMin = time / 60000;
  console.log(allTypedEntries, time, allTypedEntries / 5 / timeInMin);

  return allTypedEntries / 5 / timeInMin;
};

const addDrop = (background: string) => {
  const container = document.getElementById("ripple-container");
  if (container) {
    const ripple = document.createElement("span");
    ripple.style.left = `${Math.floor(Math.random() * window.innerWidth)}px`;
    ripple.style.top = `${Math.floor(Math.random() * window.innerHeight)}px`;
    ripple.style.width = ripple.style.height = `${
      Math.floor(Math.random() * 300) + 100
    }px`;
    ripple.style.animation = `ripple ${
      Math.floor(Math.random() * 400) + 500
    }ms linear`;
    ripple.style.backgroundColor = background;
    ripple.classList.add("ripple");
    ripple.addEventListener("animationend", () => {
      ripple.remove();
    });
    container.appendChild(ripple);
  }
};

interface ITypeProps {
  selectedTheme: string;
  setSelectedTheme: React.Dispatch<React.SetStateAction<ThemeNames>>;
}

const Type = ({ selectedTheme, setSelectedTheme }: ITypeProps) => {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [inputIncorrect, setInputIncorrect] = useState<boolean | null>(null);
  const [complete, setComplete] = useState(false);
  const [start, setStart] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [wordCount, setWordCount] = useState(10);
  const theme = useTheme();

  const [wordMap, setWordMap] = useState<Map[]>(createNewWordList(wordCount));
  const inputRef = useRef<HTMLInputElement>(null);

  const resetWordMap = () => {
    const newMap = createNewWordList(wordCount);
    newMap[0].correct = 0;
    setWordMap(newMap);
  };

  const reset = () => {
    setIndex(0);
    setInput("");
    setInputIncorrect(null);
    setComplete(false);
    setStart(false);
    setStartTime(0);
    setEndTime(0);

    resetWordMap();
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;
    const answer = wordMap[index]?.word;

    if (!start) {
      setStart(true);
      setStartTime(Date.now());
    }

    const lastCharIsSpace = value.charAt(value.length - 1) === " ";
    if (lastCharIsSpace) {
      if (index <= wordMap.length - 1) {
        if (value.trim() === answer) {
          wordMap[index].correct = 1;
        } else {
          wordMap[index].correct = 2;
        }

        if (wordMap[index + 1]) {
          wordMap[index + 1].correct = 0;
        }
      }

      setInput("");
      setIndex((prevIndex) => prevIndex + 1);
      setInputIncorrect(null);

      if (index === wordMap.length - 1) {
        setComplete(true);
        setEndTime(Date.now());
      }
    } else {
      // Is last word?
      if (index === wordMap.length - 1 && value.trim() === answer) {
        wordMap[index].correct = 1;
        setComplete(true);
        setEndTime(Date.now());
      }

      setInput(e.target.value);
      setInputIncorrect(answer ? !isWordCorrect(value.trim(), answer) : null);
    }

    setWordMap(wordMap);
  };

  const handleButtonClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.currentTarget.blur();
    if (inputRef.current) inputRef.current.focus();

    reset();
  };

  useEffect(() => {
    const handleKeyDown = () => {
      addDrop(Color(theme.background).lighten(0.9).alpha(0.5).rgb().toString());
    };
    const ref = inputRef.current;

    ref?.addEventListener("keydown", handleKeyDown);

    return () => {
      ref?.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputRef, theme.background]);

  return (
    <Type.Main>
      <div id="ripple-container"></div>
      <div className="wrapper">
        <Type.Container>
          <h1>
            WPM: {Math.round(calculateGrossWPM(wordMap, endTime - startTime))}
          </h1>
          <Type.WordList>
            {wordMap.map(({ word, correct }, index) => {
              return (
                <span
                  key={"wordList_" + index}
                  className={CORRECT_MAP[correct]}
                >
                  {word}
                </span>
              );
            })}
          </Type.WordList>

          <div className="inputRow">
            <input
              className={inputIncorrect ? "incorrect" : ""}
              value={input}
              onChange={handleInputChange}
              ref={inputRef}
            />
            <button onClick={handleButtonClick}>redo</button>
          </div>
        </Type.Container>
      </div>
      <Footer
        selectedTheme={selectedTheme}
        setSelectedTheme={setSelectedTheme}
      />
    </Type.Main>
  );
};

export default Type;

Type.Main = styled.main`
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  background-color: ${({ theme }) => theme.background};

  .wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10;

    * {
      font-family: "Roboto Mono", monospace;
      font-size: 24px;
    }
  }

  #ripple-container {
    span.ripple {
      position: absolute;
      border-radius: 50%;
      transform: scale(0);
    }

    @keyframes ripple {
      to {
        transform: scale(1);
        opacity: 0;
      }
    }
  }

  ${Footer.Footer} {
    * {
      font-family: "PressStart", monospace;
    }
  }

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

Type.Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);

  padding: 1.5rem;
  border-radius: 0.5rem;
  width: 800px;

  font-size: 1rem;
  line-height: 1rem;

  background-color: ${({ theme }) => theme.background2};
  color: gray;

  .inputRow {
    display: flex;
    gap: 0.75rem;

    height: 1.5em;
    margin: 2em auto 0.5em;
  }

  input {
    display: block;
    padding: 0.25em 0.5em;

    width: 80%;

    color: white;
    background-color: ${({ theme }) => theme.background3};
  }

  input.incorrect {
    background-color: ${({ theme }) => theme.error};
  }

  button {
    padding: 0.5rem;
    background-color: ${({ theme }) => theme.accent};
    border: none;
  }

  button:hover {
    cursor: pointer;
  }

  h1 {
    position: absolute;
    margin-top: -50px;
  }
`;

Type.WordList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75em;
  height: auto;
  direction: ltr;

  span {
    direction: ltr;
  }

  .correct {
    color: ${({ theme }) => theme.accent};
  }

  .incorrect {
    color: ${({ theme }) => theme.error};
  }

  .active {
    color: ${({ theme }) => theme.text};
  }
`;

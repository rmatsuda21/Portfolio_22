import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

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

const createNewWordList = () => {
  const words: Map[] = [];
  for (let i = 0; i < 100; ++i) {
    const randWord = Math.floor(Math.random() * englishData.words.length);
    words.push({ word: englishData.words[randWord], correct: -1 });
  }
  return words;
};

const Type = () => {
  const [wordMap, setWordMap] = useState<Map[]>(createNewWordList());

  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [inputIncorrect, setInputIncorrect] = useState<boolean | null>(null);
  const [complete, setComplete] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const resetWordMap = () => {
    const newMap = createNewWordList();
    newMap[0].correct = 0;
    setWordMap(newMap);
  };

  const reset = () => {
    setIndex(0);
    setInput("");
    setInputIncorrect(null);
    setComplete(false);

    resetWordMap();
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;
    const answer = wordMap[index]?.word;

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
    } else {
      // Is last word?
      if (index === wordMap.length - 1 && value.trim() === answer) {
        wordMap[index].correct = 1;
        setComplete(true);
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

  return (
    <Type.Main>
      <Type.Wrapper>
        {complete && <h1>🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉</h1>}
        <Type.Container>
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
      </Type.Wrapper>
    </Type.Main>
  );
};

export default Type;

Type.Main = styled.main`
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  background-color: ${({ theme }) => theme.background};

  * {
    font-family: "Roboto Mono", monospace;
    font-size: 24px;
  }
`;

Type.Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

Type.Container = styled.div`
  padding: 1.5rem;
  border-radius: 0.5rem;
  max-width: 800px;

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

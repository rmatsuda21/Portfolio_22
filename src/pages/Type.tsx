import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

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

const Type = () => {
  const [text, setText] = useState(
    "The quick brown fox jumped over the lazy dog"
  );
  const [wordMap, setWordMap] = useState<Map[]>([]);

  useEffect(() => {
    const textArray = text.split(" ");
    const map: Map[] = textArray.map((word) => {
      return { word, correct: -1 };
    });

    map[0].correct = 0;
    setWordMap(map);
  }, [text]);

  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [inputIncorrect, setInputIncorrect] = useState<boolean | null>(null);
  const [complete, setComplete] = useState(false);

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;
    const answer = wordMap[index].word;

    if (value.charAt(value.length - 1) === " ") {
      if (value.trim() === answer) {
        wordMap[index].correct = 1;
      } else {
        wordMap[index].correct = 2;
      }

      if (index < wordMap.length - 1) {
        wordMap[index + 1].correct = 0;
      } else {
        setComplete(true);
      }

      setInput("");
      setIndex((prevIndex) => prevIndex + 1);
      setInputIncorrect(null);
    } else {
      setInput(e.target.value);
      setInputIncorrect(!isWordCorrect(value.trim(), answer));
    }
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

          <input
            className={inputIncorrect ? "incorrect" : ""}
            value={input}
            onChange={handleInputChange}
          ></input>
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
`;

Type.Wrapper = styled.div`
  width: 100%;
  height: 100%;
  margin: 1em;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

Type.Container = styled.div`
  padding: 1rem;
  max-width: 800px;

  font-size: 1rem;
  line-height: 1rem;

  background-color: ${({ theme }) => theme.background2};
  color: gray;

  input {
    display: block;
    margin: 1em auto 0.5em;
    padding: 0.5em;

    font-size: 1rem;
    line-height: 1rem;

    color: white;
    background-color: ${({ theme }) => theme.background3};
  }

  input.incorrect {
    background-color: ${({ theme }) => theme.error};
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

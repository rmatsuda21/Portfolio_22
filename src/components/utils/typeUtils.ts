import random from "lodash/random";

import { CorrectType, ILanguage, Map } from "../type/typeTypes";
const englishData: ILanguage = require("../../languages/english.json");

const DROP_MIN_WIDTH = 300;
const DROP_MAX_WIDTH = 600;

export const isWordCorrect = (currWord: string, answer: string): boolean => {
  if (currWord.length > answer.length) return false;

  return answer.substring(0, currWord.length) === currWord;
};

export const createNewWordList = (listLength = 100) => {
  const words: Map[] = [];
  for (let i = 0; i < listLength; ++i) {
    const randWord = Math.floor(Math.random() * englishData.words.length);
    words.push({ word: englishData.words[randWord], correct: "" });
  }
  return words;
};

export const calculateWPM = (
  wordMap: Map[],
  time: number
): { netWPM: number; grossWPM: number } => {
  if (wordMap === undefined || time <= 0) return { netWPM: 0, grossWPM: 0 };

  let allTypedEntries = 0,
    incorrectTypedEntries = 0;
  wordMap.forEach(({ word, correct }) => {
    allTypedEntries += word.length;

    if (correct === CorrectType.Incorrect) {
      incorrectTypedEntries += word.length;
    }
  });

  const timeInMin = time / 60000;
  const grossWPM = allTypedEntries / 5 / timeInMin;
  const netWPM = grossWPM - incorrectTypedEntries / timeInMin;

  return { netWPM: netWPM < 0 ? 0 : netWPM, grossWPM };
};

export const addDrop = (background: string) => {
  const container = document.getElementById("ripple-container");
  if (container) {
    const ripple = document.createElement("span");
    const rippleWidth = random(DROP_MIN_WIDTH, DROP_MAX_WIDTH);

    ripple.style.left = `${Math.floor(Math.random() * window.innerWidth)}px`;
    ripple.style.top = `${Math.floor(Math.random() * window.innerHeight)}px`;
    ripple.style.width = ripple.style.height = `${rippleWidth}px`;
    ripple.style.animation = `ripple ${rippleWidth * 1.75}ms linear`;
    ripple.style.backgroundColor = background;
    ripple.classList.add("ripple");
    ripple.addEventListener("animationend", () => {
      ripple.remove();
    });
    container.appendChild(ripple);
  }
};

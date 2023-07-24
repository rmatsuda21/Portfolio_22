export interface ILanguage {
  name: string;
  noLazyMode: boolean;
  orderedByFrequency: true;
  words: string[];
}

export interface Map {
  word: string;
  correct: string;
}

export const CorrectType = {
  Correct: "correct",
  Incorrect: "incorrect",
  Active: "active",
};

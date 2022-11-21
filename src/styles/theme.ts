export interface ITheme {
  background: string;
  background2: string;
  background3: string;
  text: string;
  error: string;
  error2: string;
  accent: string;
  accent2: string;
  border: string;
}

export enum ThemeNames {
  SOLARIZED_DARK = "solarizedDark",
  SOLARIZED_LIGHT = "solarizedLight",
}

export const themes: Record<ThemeNames, ITheme> = {
  solarizedDark: {
    background: "#002b36",
    background2: "#00222b",
    background3: "#01546b",
    text: "#268bd2",
    error: "#d33682",
    error2: "#9b225c",
    accent: "#859900",
    accent2: "#2aa198",
    border: "5px solid #859900",
  },
  solarizedLight: {
    background: "#fdf6e3",
    background2: "#eee8d5",
    background3: "#a6956c",
    text: "#181819",
    error: "#d33682",
    error2: "#9b225c",
    accent: "#859900",
    accent2: "#2aa198",
    border: "5px solid #859900",
  },
};

import styled from "styled-components";
import { ThemeNames } from "../../../styles/theme";

interface IMenuProps {
  $footerHeight: number;
  setSelectedTheme: React.Dispatch<React.SetStateAction<ThemeNames>>;
}

const themeMapping: Record<ThemeNames, string> = {
  [ThemeNames.SOLARIZED_DARK]: "Solarized Dark",
  [ThemeNames.SOLARIZED_LIGHT]: "Solarized Light",
};

export const Menu = ({ $footerHeight, setSelectedTheme }: IMenuProps) => {
  return (
    <Menu.Menu $footerHeight={$footerHeight}>
      <h1>Menu</h1>
      <div>
        <select
          onChange={(e) => {
            setSelectedTheme(e.target.value as ThemeNames);
          }}
        >
          {Object.keys(themeMapping).map((theme) => {
            return (
              <option value={theme}>{themeMapping[theme as ThemeNames]}</option>
            );
          })}
        </select>
      </div>
    </Menu.Menu>
  );
};

Menu.Menu = styled.div<{ $footerHeight: number }>`
  position: absolute;
  bottom: ${({ $footerHeight }) => $footerHeight}px;

  width: 200px;
  height: 200px;
  padding: 10px;

  border: ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.background2};
  color: ${({ theme }) => theme.text};
`;

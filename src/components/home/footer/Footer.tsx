import { useCallback, useState } from "react";
import styled from "styled-components";
import { ThemeNames } from "../../../styles/theme";
import { Clock } from "./Clock";
import { Icon } from "./Icon";
import { Menu } from "./Menu";

const FOOTER_HEIGHT = 60;

interface IFooterProps {
  selectedTheme: string;
  setSelectedTheme: React.Dispatch<React.SetStateAction<ThemeNames>>;
}

export const Footer = ({ selectedTheme, setSelectedTheme }: IFooterProps) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleShowMenu = useCallback(() => {
    setShowMenu((prevShowMenu) => !prevShowMenu);
  }, [setShowMenu]);

  return (
    <Footer.Footer $footerHeight={FOOTER_HEIGHT}>
      {showMenu && (
        <Menu
          $footerHeight={FOOTER_HEIGHT}
          selectedTheme={selectedTheme}
          setSelectedTheme={setSelectedTheme}
        />
      )}
      <Icon $footerHeight={FOOTER_HEIGHT} onClick={toggleShowMenu} />
      <Clock />
    </Footer.Footer>
  );
};

Footer.Footer = styled.div<{ $footerHeight: number }>`
  z-index: 9999;

  width: calc(100% - 20px);
  height: ${({ $footerHeight }) => $footerHeight}px;
  padding-inline: 10px;

  position: fixed;
  bottom: 0;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  background-color: ${({ theme }) => theme.background2};
`;

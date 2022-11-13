import { useCallback, useState } from "react";
import styled from "styled-components";
import { Clock } from "./Clock";
import { Icon } from "./Icon";
import { Menu } from "./Menu";

const FOOTER_HEIGHT = 60;

export const Footer = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleShowMenu = useCallback(() => {
    setShowMenu((prevShowMenu) => !prevShowMenu);
  }, [setShowMenu]);

  return (
    <Footer.Footer $footerHeight={FOOTER_HEIGHT}>
      {showMenu && <Menu $footerHeight={FOOTER_HEIGHT} />}
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

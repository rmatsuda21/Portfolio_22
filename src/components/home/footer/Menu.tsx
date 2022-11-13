import styled from "styled-components";

export const Menu = ({ $footerHeight }: { $footerHeight: number }) => {
  return <Menu.Menu $footerHeight={$footerHeight}>Menu</Menu.Menu>;
};

Menu.Menu = styled.div<{ $footerHeight: number }>`
  position: absolute;
  bottom: ${({ $footerHeight }) => $footerHeight}px;

  width: 200px;
  height: 200px;
  padding: 10px;

  border: ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.background2};
`;

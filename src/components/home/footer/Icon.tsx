import styled from "styled-components";
import logo from "../../../images/logo.png";

export const Icon = ({
  $footerHeight,
  onClick,
}: {
  $footerHeight: number;
  onClick: () => void;
}) => {
  return (
    <Icon.Icon onClick={onClick}>
      <img
        src={logo}
        alt="logo"
        width={`${$footerHeight - 10}px`}
        height={`${$footerHeight - 10}px`}
      />
    </Icon.Icon>
  );
};

Icon.Icon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  aspect-ratio: 1 / 1;

  &:hover {
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

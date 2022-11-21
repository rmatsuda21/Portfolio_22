import styled from "styled-components";

export const Display = ({ content }: { content: number }) => {
  return <Display.Container>{("000" + content).slice(-3)}</Display.Container>;
};

Display.Container = styled.div`
  background-color: rgb(100, 20, 20);
  color: rgb(255, 50, 50);
  font-size: 1.25em;
  width: fit-content;
  padding: 5px;
  margin-block: auto;
`;

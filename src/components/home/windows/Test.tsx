import styled from "styled-components";

export const Test = () => <Test.Container></Test.Container>;

Test.Container = styled.div`
  width: 800px;
  height: 300px;

  background-color: ${({ theme }) => theme.background};
`;

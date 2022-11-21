import styled from "styled-components";

export interface ITestProps {
  test?: string;
}

export const Test = ({ test }: ITestProps) => (
  <Test.Container>{String(test)}</Test.Container>
);

Test.Container = styled.div`
  width: 800px;
  height: 300px;

  background-color: ${({ theme }) => theme.background};
`;

import styled from "styled-components";

interface IWindowMenuProps {
  componentProps?: { [key: string]: any };
  setComponentProps: React.Dispatch<React.SetStateAction<Object>>;
}

const isNumeric = (str: string) => {
  if (typeof str != "string") return false;
  return !isNaN(parseFloat(str));
};

const typeMap = {
  number: "number",
  string: "text",
  boolean: "checkbox",
  bigint: "",
  symbol: "",
  undefined: "",
  object: "",
  function: "",
};

export const WindowMenu = ({
  componentProps = {},
  setComponentProps,
}: IWindowMenuProps) => {
  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    if (
      typeof componentProps[key] === "number" ||
      typeof componentProps[key] === "string"
    ) {
      if (typeof componentProps[key] === "number" && !isNumeric(e.target.value))
        return;
      setComponentProps((prevProps) => {
        if (typeof componentProps[key] === "number") {
          return {
            ...prevProps,
            [key]: Number.parseInt(e.target.value),
          };
        }
        return { ...prevProps, [key]: e.target.value };
      });
    } else if (typeof componentProps[key] === "boolean") {
      setComponentProps((prevProps) => {
        return { ...prevProps, [key]: e.target.checked };
      });
    }
  };

  return (
    <WindowMenu.Container>
      {Object.keys(componentProps).map((key, indx) => (
        <WindowMenu.Row key={indx}>
          <h1>{key}</h1>
          <input
            type={typeMap[typeof componentProps[key]]}
            onChange={(e) => handleOnChange(e, key)}
            value={componentProps[key]}
          />
        </WindowMenu.Row>
      ))}
    </WindowMenu.Container>
  );
};

WindowMenu.Container = styled.div`
  z-index: 1;
  position: absolute;
  padding: 10px;
  max-height: 200px;

  display: flex:
  flex-direction: column;

  background-color: rgba(255, 255, 255, 0.6);
  border: 5px solid rgba(255, 255, 255, 0.8);
  top: 100%;
  left: 0;
`;

WindowMenu.Row = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  input {
    width: 8rem;
    font-size: 10px;
  }
`;

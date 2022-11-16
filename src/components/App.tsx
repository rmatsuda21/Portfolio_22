import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Home } from "../pages/Home";
import { ThemeNames, themes } from "../styles/theme";

function App() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeNames>(
    ThemeNames.SOLARIZED_DARK
  );

  return (
    <div className="App">
      <button
        onClick={() => {
          const keys = Object.keys(ThemeNames);
          setSelectedTheme(
            Object(ThemeNames)[keys[Math.floor(Math.random() * keys.length)]]
          );
        }}
      >
        CLICK
      </button>
      <ThemeProvider theme={themes[selectedTheme]}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<h1>TEST</h1>} />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;

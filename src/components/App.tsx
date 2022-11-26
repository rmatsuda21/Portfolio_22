import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import { Home } from "../pages/Home";
import { ThemeNames, themes } from "../styles/theme";
import { AblyProvider } from "./hooks/AblyProvider";

function App() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeNames>(
    ThemeNames.SOLARIZED_DARK
  );

  return (
    <div className="App">
      <AblyProvider>
        <ThemeProvider theme={themes[selectedTheme]}>
          <Routes>
            <Route
              path="/"
              element={<Home setSelectedTheme={setSelectedTheme} />}
            />
            <Route path="/test" element={<h1>TEST</h1>} />
          </Routes>
        </ThemeProvider>
      </AblyProvider>
    </div>
  );
}

export default App;

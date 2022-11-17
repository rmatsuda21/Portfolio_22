import { useEffect, useState } from "react";
import { Realtime } from "ably";
import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import { Home } from "../pages/Home";
import { ThemeNames, themes } from "../styles/theme";

const ably = new Realtime(process.env.REACT_APP_ABLY_KEY as string);
const channel = ably.channels.get("channel1");

function App() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeNames>(
    ThemeNames.SOLARIZED_DARK
  );

  useEffect(() => {
    channel.subscribe("test", (event) => {
      console.log("Got message", event.data);
    });

    return () => {
      channel.detach();
    };
  }, []);

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
      <button
        onClick={() => {
          channel.publish("greeting", "hello");
        }}
      >
        CLICK ME
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

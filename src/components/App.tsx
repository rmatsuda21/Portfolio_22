import { useEffect, useState } from "react";
import { Realtime } from "ably";
import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { useCookies } from "react-cookie";

import { Home } from "../pages/Home";
import { ThemeNames, themes } from "../styles/theme";

const clientId = uuidv4();
const apiKey = process.env.REACT_APP_ABLY_KEY as string;
const ably = new Realtime({ key: apiKey, clientId });
const channel = ably.channels.get("channel1");

function App() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeNames>(
    ThemeNames.SOLARIZED_DARK
  );

  const [cookies, setCookie] = useCookies(["deviceId"]);
  setCookie("deviceId", clientId, { sameSite: "strict" });
  console.log(cookies.deviceId);

  useEffect(() => {
    channel.subscribe("test", (event) => {
      console.log("Got message", event.data, "from", event.clientId);
    });

    return () => {
      channel.detach();
    };
  }, []);

  return (
    <div className="App">
      <ThemeProvider theme={themes[selectedTheme]}>
        <Routes>
          <Route
            path="/"
            element={<Home setSelectedTheme={setSelectedTheme} />}
          />
          <Route path="/test" element={<h1>TEST</h1>} />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;

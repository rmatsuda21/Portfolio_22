import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ItemsProvider } from "../contexts/items-context";
import ReOS from "../pages/ReOS";
import Icon from "./Icon";
import Window from "./Window";

function App() {
    const [windows, setWindows] = useState([
        <Icon initPos={[0, 0]} elem={Window} />,
        <Window initPos={[0, 0]} initSize={[400, 400]}>
            <h1>Test</h1>
        </Window>,
    ]);

    return (
        <div className="App">
            <Routes>
                <Route
                    path="/"
                    element={
                        <ItemsProvider>
                            <ReOS />
                        </ItemsProvider>
                    }
                />
                <Route path="/test" element={<h1>TEST</h1>} />
            </Routes>
        </div>
    );
}

export default App;

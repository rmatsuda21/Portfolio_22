import React, { useState } from "react";
import DragAndMove from "./DragAndMove";

function Window({ children, initPos, initSize }) {
    const [position, setPosition] = useState(initPos);
    const [size, setSize] = useState(initSize);

    const style = {
        position: "absolute",
        backgroundColor: "red",
        left: position[0],
        top: position[1],
        maxWidth: size[0],
        maxHeight: size[1],
        width: size[0],
        height: size[1],
    };

    const barStyle = {
        backgroundColor: "black",
        padding: 10,
    };

    return (
        <div style={style}>
            <DragAndMove
                style={barStyle}
                position={position}
                setPosition={setPosition}
            >
                <button onClick={() => alert(10)}>CLICK ME</button>
            </DragAndMove>
            {children}
        </div>
    );
}

export default Window;

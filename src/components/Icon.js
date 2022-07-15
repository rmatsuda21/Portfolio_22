import React, { useState } from "react";
import DragAndMove from "./DragAndMove";

function Icon({ initPos, elem }) {
    const [position, setPosition] = useState(initPos);

    const style = {
        position: "absolute",
        backgroundColor: "red",
        left: position[0],
        top: position[1],
        padding: 20,
        margin: 0,
        "&:hover": {
            backgroundColor: "white",
        },
    };

    return (
        <DragAndMove
            style={style}
            position={position}
            setPosition={setPosition}
            onClick={() => {
                alert("CLICKED");
            }}
        >
            <h1>
                MOVE
                <br />
                ME
            </h1>
        </DragAndMove>
    );
}

export default Icon;

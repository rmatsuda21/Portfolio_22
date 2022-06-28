import React from "react";
import DraggableContainer from "./DraggableContainer";

function Window() {
    const style = {
        position: "absolute",
    };

    return (
        <>
            <DraggableContainer>
                <h1>Title Here</h1>
                <div
                    style={{
                        backgroundColor: "black",
                        width: "200px",
                        height: "100px",
                        pointerEvents: "none",
                    }}
                >
                    Hi
                </div>
            </DraggableContainer>
        </>
    );
}

export default Window;

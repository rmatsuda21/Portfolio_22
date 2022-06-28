import React, { useEffect, useState } from "react";

function DraggableContainer({ children, onClick }) {
    const [isActive, setIsActive] = useState(false);
    const [anchorPoint, setAnchorPoint] = useState([]);
    const [position, setPosition] = useState([0, 0]);

    const handleMouseMove = (e) => {
        if (!isActive) return;

        const { clientX, clientY } = e;
        const [posX, posY] = anchorPoint;

        setPosition([clientX - posX, clientY - posY]);
    };

    const handleMouseDown = (e) => {
        setIsActive(true);

        const { clientX, clientY } = e;
        const [posX, posY] = position;

        setAnchorPoint([clientX - posX, clientY - posY]);
    };

    const handleMouseUp = () => {
        setIsActive(false);
    };

    const style = {
        position: "absolute",
        cursor: "pointer",
        backgroundColor: isActive ? "red" : "blue",
        left: position[0],
        top: position[1],
    };

    return (
        <div
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onClick={onClick}
            style={style}
        >
            {children}
        </div>
    );
}

export default DraggableContainer;

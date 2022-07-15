import React, { useEffect, useState } from "react";

function DragAndMove({
    children,
    onClick = () => {},
    position,
    setPosition,
    style,
}) {
    const [isActive, setIsActive] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [anchorPoint, setAnchorPoint] = useState([]);

    const handleMouseMove = (e) => {
        if (!isActive) return;

        const { clientX, clientY } = e;
        const [posX, posY] = anchorPoint;

        setPosition([clientX - posX, clientY - posY]);
        setIsDragging(true);
    };

    const handleMouseDown = (e) => {
        setIsActive(true);

        const { clientX, clientY } = e;
        const [posX, posY] = position;

        setAnchorPoint([clientX - posX, clientY - posY]);
    };

    const handleMouseUp = () => {
        if (!isDragging) onClick();

        setIsActive(false);
        setIsDragging(false);
    };

    return (
        <div
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            style={{ ...style, cursor: "pointer" }}
        >
            {children}
        </div>
    );
}

export default DragAndMove;

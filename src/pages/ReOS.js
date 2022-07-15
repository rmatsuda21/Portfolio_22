import React, { useEffect, useState } from "react";
import Window from "../components/Window";
import { useItems } from "../contexts/items-context";

function ReOS() {
    const [{ items }, dispatch] = useItems();
    const [id, setID] = useState(0);

    // useEffect(() => {
    //     // TESTING COMMENT BELOW IF YOU ARE NOT TESTING!!!
    //     sessionStorage.removeItem("items");

    //     let items = sessionStorage.getItem("items");
    //     if (items == null) {
    //         items = [];
    //     } else {
    //         items = JSON.parse(items);
    //     }

    //     sessionStorage.setItem("items", JSON.stringify(items));
    //     setItems(items);
    // }, []);

    return (
        <>
            <button
                onClick={() => {
                    dispatch({
                        type: "add",
                        item: {
                            Component: Window,
                            props: {
                                initSize: [200, 200],
                                initPos: [0, 0],
                            },
                        },
                    });
                }}
            >
                ADD ITEM
            </button>
            <input
                type="number"
                value={id}
                onChange={(e) => {
                    setID(Number.parseInt(e.target.value));
                }}
            />
            <button
                onClick={() => {
                    dispatch({
                        type: "remove",
                        id: id,
                    });
                }}
            >
                REMOVE
            </button>
            {items &&
                items.map(({ Component, props }, indx) => {
                    return <Component key={indx} {...props}></Component>;
                })}
        </>
    );
}

export default ReOS;

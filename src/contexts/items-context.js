import {
    createContext,
    useContext,
    useEffect,
    useReducer,
    useState,
} from "react";

const ItemsContext = createContext(undefined);
const initialState = { maxID: 0, items: [] };

function ItemsProvider({ children }) {
    const [items, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        console.log(items);

        return () => {
            console.log("RETURN");
        };
    }, [items]);

    return (
        <ItemsContext.Provider value={[items, dispatch]}>
            {children}
        </ItemsContext.Provider>
    );
}

function useItems() {
    const context = useContext(ItemsContext);
    if (!context)
        throw new Error("useItems must be used within ItemsProvider!");

    return context;
}

function reducer(state, action) {
    switch (action.type) {
        case "":
            return state;
        case "add":
            return {
                ...state,
                maxID: state.maxID + 1,
                items: [...state.items, { ...action.item, id: state.maxID }],
            };
        case "remove":
            const items = state.items.filter((item) => {
                console.log(item.id == action.id);
                return item.id != action.id;
            });
            console.log(items);
            return {
                ...state,
                items: items,
            };
        default:
            throw new Error(`Invalid Type: ${action.type}!`);
    }
}

export { ItemsProvider, useItems };

import React, { createContext, useContext, useEffect, useState } from "react";
import { GlobalState } from "renderer/types/globalState";

const GlobalStateContext = createContext<
    [Partial<GlobalState>, (key: keyof GlobalState, value: any) => void]
>([{}, (key, val) => {}]);

export function GlobalStateProvider(props: { children: React.ReactNode }) {
    const [state, setState] = useState<Partial<GlobalState>>(
        window.localStorage.globalState
            ? JSON.parse(window.localStorage.globalState)
            : {}
    );

    return (
        <GlobalStateContext.Provider
            value={[
                state,
                (key, value) => {
                    setState({ ...state, [key]: value });
                    window.localStorage.setItem(
                        "globalState",
                        JSON.stringify({ ...state, [key]: value })
                    );
                },
            ]}
        >
            {props.children}
        </GlobalStateContext.Provider>
    );
}

export function useGlobal(key: keyof GlobalState): [any, (value: any) => void] {
    const context = useContext(GlobalStateContext);

    return [context[0][key], (value) => context[1](key, value)];
}

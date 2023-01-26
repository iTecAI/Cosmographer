import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { useDB } from "./database";
import { dataDirectory } from "./utilFuncs";
import { join } from "path";

export type UserConfig = {
    theme: "dark" | "light";
};

const UserConfigContext = createContext<
    [Partial<UserConfig>, (config: Partial<UserConfig>) => void]
>([{}, (config) => {}]);

const DATA_DIR = dataDirectory();

export function UserConfigProvider(props: {
    children?: ReactNode | ReactNode[];
}) {
    const [data, setData] = useDB<UserConfig>(join(DATA_DIR, "settings.json"));

    return (
        <UserConfigContext.Provider value={[data, (newConfig) => {}]}>
            {props.children}
        </UserConfigContext.Provider>
    );
}

export function useConfig(): [
    Partial<UserConfig>,
    (config: Partial<UserConfig>) => void
] {
    const [config, setConfig] = useContext(UserConfigContext);
    return [config, setConfig];
}

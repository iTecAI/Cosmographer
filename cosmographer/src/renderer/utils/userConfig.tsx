import {
    ReactNode,
    createContext,
    useContext,
    useMemo,
} from "react";
import { useDB } from "./database";
import { dataDirectory } from "./utilFuncs";
import { join } from "path";
import { defaultsDeep } from "lodash";

import { UserConfig, DEFAULT_CONFIG } from "renderer/types/userconfig";

const UserConfigContext = createContext<
    [Partial<UserConfig>, (config: Partial<UserConfig>) => void]
>([{}, (config) => {}]);

const DATA_DIR = dataDirectory();

export function UserConfigProvider(props: {
    children?: ReactNode | ReactNode[];
}) {
    const [data, update] = useDB<UserConfig>(join(DATA_DIR, "settings.json"));

    return (
        <UserConfigContext.Provider value={[data, (newConfig) => {
            update(newConfig);
        }]}>
            {props.children}
        </UserConfigContext.Provider>
    );
}

export function useConfig(): [
    Partial<UserConfig>,
    (config: Partial<UserConfig>) => void
] {
    const [config, setConfig] = useContext(UserConfigContext);

    useMemo(() => {
        const defSet = defaultsDeep({...config}, DEFAULT_CONFIG);
        setConfig(defSet);
    }, [])

    return [config, setConfig];
}

import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useReducer,
    useState,
} from "react";
import { set, unset, get, entries } from "lodash";
import { join } from "path";
import { expose } from "./ipc/general";
import { readFile, readdir, stat } from "./ipc/fs";

type Watchers = {
    [key: string]: {
        __listener: boolean;
        [key: number]: (path: string) => void;
    };
};

type WatcherAction =
    | {
          action: "add";
          path: string;
          key: number;
          listener: (path: string) => void;
      }
    | {
          action: "remove";
          path: string;
          key: number;
      }
    | {
          action: "activate";
          path: string;
      };

const WatchContext = createContext<[Watchers, (action: WatcherAction) => void]>(
    [{}, (action) => {}]
);

function watcherReducer(state: Watchers, action: WatcherAction) {
    const newState = { ...state };
    switch (action.action) {
        case "add":
            if (action.path.length === 0) {
                return newState;
            }
            set(newState, [action.path, action.key], action.listener);
            if (get(state, [action.path], null) === null) {
                set(newState, [action.path, "__listener"], false);
            }
            return newState;
        case "remove":
            unset(newState, [action.path, action.key]);
            if (Object.keys(get(newState, [action.path]) ?? {}).length === 0) {
                expose.removeWatch(action.path);
                unset(newState, [action.path]);
            }
            return newState;
        case "activate":
            set(newState, [action.path, "__listener"], true);
            return newState;
    }
}

export function WatchProvider(props: { children?: ReactNode | ReactNode[] }) {
    const [watchers, dispatchWatchers] = useReducer(watcherReducer, {});

    useEffect(() => {
        for (const key of Object.keys(watchers)) {
            if (watchers[key].__listener === false) {
                expose.watch(key, (event, filename) => {
                    entries(watchers[key]).forEach(([_key, listener]) => {
                        if (_key === "__listener") {
                            return;
                        } else {
                            (listener as (path: string) => void)(key);
                        }
                    });
                });
            }
        }
    }, [watchers]);

    return (
        <WatchContext.Provider value={[watchers, dispatchWatchers]}>
            {props.children}
        </WatchContext.Provider>
    );
}

export function useWatch(...path: string[]): string | string[] | null {
    const [watchers, dispatchWatchers] = useContext(WatchContext);
    const [cpath, setCpath] = useState<string>("");
    const [key] = useState<number>(Math.random());
    const [data, setData] = useState<string | string[] | null>(null);

    useEffect(() => {
        if (join(...path) === cpath) {
            return;
        }
        if (cpath !== "") {
            dispatchWatchers({ action: "remove", path: cpath, key });
        }
        setCpath(join(...path));
        dispatchWatchers({
            action: "add",
            path: join(...path),
            key,
            listener: (npath: string) => {
                const stats: any = stat(npath);
                if (stats.directory) {
                    setData(readdir(npath) as string[]);
                } else {
                    setData(readFile(npath));
                }
            },
        });
    }, [path]);

    return data;
}

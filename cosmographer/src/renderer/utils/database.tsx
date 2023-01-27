import { readFile, writeFile, exists, mkdir } from "./ipc/fs";
import { Low } from "lowdb";
import { isEqual, set, merge, cloneDeep } from "lodash";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { dirname } from "path";

class CosmJsonAdapter<T = any> {
    constructor(public path: string) {
        if (!exists(this.path)) {
            if (!exists(dirname(this.path))) {
                mkdir(dirname(this.path), true);
            }
            writeFile(this.path, JSON.stringify({}));
        }
    }

    async read(): Promise<T> {
        return JSON.parse(readFile(this.path));
    }

    async write(data: T) {
        writeFile(this.path, JSON.stringify(data));
    }
}

const DBContext = createContext<
    [{ [path: string]: [any, Low<any>] }, (path: string, data?: any) => any]
>([{}, (path, data) => {}]);

export function DBContextProvider(props: {
    children: ReactNode | ReactNode[];
}) {
    const [dbs, setDbs] = useState<{ [path: string]: [any, Low<any>] }>({});

    return (
        <DBContext.Provider
            value={[
                dbs,
                (path, data) => {
                    if (!Object.keys(dbs).includes(path)) {
                        const newLow = new Low(new CosmJsonAdapter<any>(path));
                        newLow.read().then(() => {
                            if (!data) {
                                setDbs({
                                    ...dbs,
                                    [path]: [{ ...newLow.data }, newLow],
                                });
                            } else {
                                const newDbs = { ...dbs };
                                newDbs[path] = [{ ...newLow.data }, newLow];
                                merge(newDbs[path][0], data);
                                newDbs[path][1].data = { ...newDbs[path][0] };
                                newDbs[path][1].write().then(() => {
                                    setDbs(newDbs);
                                });
                            }
                        });
                    } else {
                        if (data) {
                            const newDbs = cloneDeep(dbs);
                            merge(newDbs[path][0], data);
                            newDbs[path][1].data = { ...newDbs[path][0] };
                            newDbs[path][1].write().then(() => {
                                if (!isEqual(newDbs[path][0], dbs[path][0])) {
                                    setDbs(newDbs);
                                }
                            });
                        }
                    }
                },
            ]}
        >
            {props.children}
        </DBContext.Provider>
    );
}

export function useDB<T>(
    path: string
): [T | {}, (update: any) => void] {
    const context = useContext(DBContext);

    useMemo(() => {
        context[1](path);
    }, [path]);

    return [(context[0][path] ?? [{}])[0], (update) => context[1](path, update)]
}

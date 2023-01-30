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
                                    ...cloneDeep(dbs),
                                    [path]: [{ ...newLow.data }, newLow],
                                });
                            } else {
                                const newItem = [{ ...newLow.data }, newLow];
                                merge(newItem[0], data);
                                newItem[1].data = { ...newItem[0] };
                                setDbs({
                                    ...(cloneDeep(dbs) as any),
                                    [path]: newItem,
                                });
                                newItem[1].write();
                            }
                        });
                    } else {
                        if (data) {
                            const newitem = cloneDeep(dbs[path]);
                            merge(newitem[0], data);
                            newitem[1].data = { ...newitem[0] };
                            if (!isEqual(newitem[0], dbs[path][0])) {
                                setDbs({ ...cloneDeep(dbs), [path]: newitem });
                            }
                            newitem[1].write();
                        }
                    }
                },
            ]}
        >
            {props.children}
        </DBContext.Provider>
    );
}

export function useDB<T>(path: string): [T | {}, (update: any) => void] {
    const context = useContext(DBContext);

    useMemo(() => {
        context[1](path);
    }, [path]);

    return [
        (context[0][path] ?? [{}])[0],
        (update) => context[1](path, update),
    ];
}

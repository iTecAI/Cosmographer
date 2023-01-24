import { exists, readFile, watch, writeFile } from "./ipc/fs";
import { Low } from "lowdb";
import { join } from "path";
import { isEqual } from "lodash";
import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useWatch } from "./WatchProvider";

class CosmJsonAdapter<T = any> {
    constructor(private path: string) {}

    async read(): Promise<T> {
        return JSON.parse(readFile(this.path));
    }

    async write(data: T) {
        writeFile(this.path, JSON.stringify(data));
    }
}

class CosmDB<T = any> {
    private adapter: CosmJsonAdapter;
    private db: Low<T>;
    private path: string;
    public data: T | {};
    constructor(...paths: string[]) {
        this.path = join(...paths);
        if (!exists(this.path)) {
            writeFile(this.path, "{}");
        }
        this.adapter = new CosmJsonAdapter<T>(this.path);
        this.db = new Low<T>(this.adapter);
        this.data = {};
        this.db.read().then(() => {
            this.data = this.db.data ?? {};
        });
    }

    public async execute(executor: (db: Low<T>) => any): Promise<any> {
        await this.db.read();
        this.data = this.db.data ?? {};
        const result = executor(this.db);
        this.db.data = this.data as T;
        await this.db.write();
        return result;
    }

    public async refresh(): Promise<T | {}> {
        await this.db.read();
        this.data = this.db.data ?? {};
        return this.data;
    }
}

const DBContext = createContext<
    [{ [key: string]: CosmDB }, (...paths: string[]) => void]
>([{}, (...paths: string[]) => {}]);

export function CosmDBProvider(props: { children?: ReactNode | ReactNode[] }) {
    const [dbs, setDbs] = useState<{ [key: string]: CosmDB }>({});

    return (
        <DBContext.Provider
            value={[
                dbs,
                (...paths: string[]) => {
                    if (!Object.keys(dbs).includes(join(...paths))) {
                        setDbs({
                            ...dbs,
                            [join(...paths)]: new CosmDB(...paths),
                        });
                    }
                },
            ]}
        >
            {props.children}
        </DBContext.Provider>
    );
}

export function useDB<T = any>(
    ...paths: string[]
): [T | {}, typeof CosmDB.prototype.execute] {
    const [dbs, activate] = useContext(DBContext);
    const [path, setPath] = useState<string>(join(...paths));
    const [data, setData] = useState<T | null>(null);

    const watched = useWatch(...paths);

    useMemo(() => {
        setPath(join(...paths));
        if (!Object.keys(dbs).includes(path)) {
            activate(path);
        }
    }, [paths]);

    useMemo(() => {
        if (path && dbs[path]) {
            dbs[path].refresh().then((value) => {
                if (!isEqual(value, data)) {
                    setData(value);
                }
            });
        }
    }, [watched]);

    return [
        data ?? {},
        async (executor) => {
            if (!(dbs && dbs[path])) {
                return {};
            }
            const result = await dbs[path].execute(executor);
            setData(dbs[path].data);
            return result;
        },
    ];
}

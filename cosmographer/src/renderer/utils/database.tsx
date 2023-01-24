import { readFile, watch, writeFile } from "./ipc/fs";
import { Low } from "lowdb";
import { join } from "path";
import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

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
        this.adapter = new CosmJsonAdapter<T>(this.path);
        this.db = new Low<T>(this.adapter);
        this.data = {};
        this.db.read().then(() => (this.data = this.db.data ?? {}));
    }

    public async execute(executor: (db: CosmDB<T>) => any): Promise<any> {
        await this.db.read();
        this.data = this.db.data ?? {};
        const result = executor(this);
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

export function useDB<T = any>(...paths: string[]): CosmDB<T> {
    const [dbs, activate] = useContext(DBContext);
    const [path, setPath] = useState<string>(join(...paths));

    useMemo(() => {
        setPath(join(...paths));
        if (!Object.keys(dbs).includes(path)) {
            activate(path);
        }
    }, [paths]);

    return dbs[path];
}

export function useDBData<T = any>(...paths: string[]): T {
    const db = useDB(...paths);
    const [data, setData] = useState<T>(db.data);

    watch(join(...paths), (eventType, filename) => {
        db.refresh().then((value) => setData(value));
    });

    return data;
}

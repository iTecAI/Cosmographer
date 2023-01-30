import { readFile, writeFile, exists, mkdir } from "./ipc/fs";
import { Low } from "lowdb";
import { isEqual, merge, cloneDeep } from "lodash";
import { useEffect, useState } from "react";
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

export function useDB<T>(path: string): [T, (update: any) => void] {
    const [data, setData] = useState<T>({} as T);
    const [low, setLow] = useState<Low<T> | null>(null);
    const [justSet, setJustSet] = useState<boolean>(false);

    useEffect(() => {
        setJustSet(true);
        setLow(new Low<T>(new CosmJsonAdapter(path)));
    }, [path]);

    useEffect(() => {
        if (low && justSet) {
            setJustSet(false);
            low.read().then(() => setData(low.data ?? ({} as T)));
        }
    }, [low]);

    useEffect(() => {
        if (low && !isEqual(low.data, data)) {
            low.data = cloneDeep(data);
            low.write();
        }
    }, [data]);

    return [
        data,
        (update) => {
            const newData = cloneDeep(data);
            merge(newData, update);
            setData({ ...newData });
        },
    ];
}

import { readFile, writeFile, exists, mkdir } from "./ipc/fs";
import { Low } from "lowdb";
import { isEqual, set } from "lodash";
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

export function useDB<T>(
    path: string
): [T | {}, (_data: any, ..._path: string[]) => void] {
    const [data, setData] = useState<T | {}>({});
    const [low, setLow] = useState<Low<T | {}>>(
        new Low(new CosmJsonAdapter<T | {}>(path))
    );

    useEffect(() => {
        if (!isEqual((low.adapter as CosmJsonAdapter<T | {}>).path, path)) {
            low.write().then(() => {
                const newLow = new Low(new CosmJsonAdapter<T | {}>(path));
                newLow.read().then(() => {
                    setLow(newLow);
                    setData(newLow.data ?? {});
                });
            });
        }
    }, [path]);

    useEffect(() => {
        if (!isEqual(data, low.data)) {
            low.data = data;
            low.write();
        }
    }, [data]);

    useEffect(() => {
        low.read().then(() => setData(low.data ?? {}));
    }, []);

    return [
        data,
        (_data, ..._path) => {
            if (_path.length > 0) {
                const newData = { ...data };
                set(newData, _path, _data);
                setData(newData);
            } else {
                setData({ ..._data });
            }
        },
    ];
}

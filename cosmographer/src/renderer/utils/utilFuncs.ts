import { dirname, join } from "path";
import { homedir, platform } from "./ipc/os";
import { exists, mkdir, readFile } from "./ipc/fs";
import { entries, isArray, isNumber, isObject, isString } from "lodash";

export function dataDirectory(): string {
    const home = homedir();
    const system = platform();

    if (exists(".data")) {
        return ".data";
    }

    let path: string;
    switch (system) {
        case "win32":
            path = join(home, "AppData", "Roaming", "cosmographer");
            break;
        default:
            path = join(home, ".local", "share", "cosmographer");
    }

    if (!exists(path)) {
        try {
            mkdir(path, true);
        } catch (err) {
            console.warn(`Failed to create ${path}, fallback to .data:`, err);
            mkdir(".data");
            return ".data";
        }
        if (!exists(path)) {
            console.warn(
                `Failed to create ${path}, fallback to .data: UNKNOWN`
            );
            mkdir(".data");
            return ".data";
        }
    }
    return path;
}

export function loadIncludeJson(opts: {data?: any, path?: string}): any {
    let data: any;
    if (!opts.data && opts.path) {
        if (!exists(opts.path)) {
            throw Error(`Path ${opts.path} not found`);
        }
        data = JSON.parse(readFile(opts.path));
    } else {
        data = isArray(opts.data) ? [...opts.data] : {...opts.data};
    }
    
    const expandedData: any = isArray(opts.data) ? [] : {};

    for (const [key, val] of entries(data)) {
        if (isString(val)) {
            if (val.startsWith("$")) {
                const parts = val.slice(1).split(":");
                switch (parts[0]) {
                    case "sub":
                        if (exists(join(dirname(opts.path ?? "."), parts[1] ?? "$$NOPATH"))) {
                            expandedData[key] = loadIncludeJson({path: join(dirname(opts.path ?? "."), parts[1] ?? "$$NOPATH")});
                        } else {
                            throw Error(`Path ${parts[1] ?? "$$NOPATH"} (${join(dirname(opts.path ?? "."), parts[1] ?? "$$NOPATH")}) of $sub not found`);
                        }
                        continue;
                    case "raw":
                        if (exists(join(dirname(opts.path ?? "."), parts[1] ?? "$$NOPATH"))) {
                            expandedData[key] = readFile(join(dirname(opts.path ?? "."), parts[1] ?? "$$NOPATH"));
                        } else {
                            throw Error(`Path ${parts[1] ?? "$$NOPATH"} (${join(dirname(opts.path ?? "."), parts[1] ?? "$$NOPATH")}) of $raw not found`);
                        }
                        continue;
                    default:
                        expandedData[key] = val;
                        continue;
                }
            }
        }
        if (isArray(val)) {
            expandedData[key] = loadIncludeJson({path: opts.path ?? ".", data: [...val]});
            continue;
        }
        if (isObject(val) && !isNumber(val) && !isString(val)) {
            expandedData[key] = loadIncludeJson({path: opts.path ?? ".", data: {...val}});
            continue;
        }
        expandedData[key] = val;
    }

    return expandedData;
}

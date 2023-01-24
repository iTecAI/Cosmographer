import { call, expose } from "./general";

export function readdir(
    path: string | Buffer | URL,
    options?: { encoding?: string }
): (string | Buffer)[] {
    return call("fs", "readdirSync", [path, options ?? {}]);
}

export function readFile(path: string): string {
    return call("fs", "readFileSync", [path, { encoding: "utf8" }]);
}

export function writeFile(path: string, data: string): void {
    call("fs", "writeFileSync", [path, data]);
}

export function watch(
    path: string,
    listener: (eventType: string, filename: string) => void
): void {
    expose.watch(path, listener);
}

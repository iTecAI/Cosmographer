import { call, get } from "./general";

export function readdir(
    path: string | Buffer | URL,
    options?: { encoding?: string }
): (string | Buffer)[] {
    return call("fs", "readdirSync", [path, options ?? {}]);
}

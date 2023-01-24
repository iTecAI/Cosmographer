import { call } from "./general";

export function platform():
    | "aix"
    | "darwin"
    | "freebsd"
    | "linux"
    | "openbsd"
    | "sunos"
    | "win32" {
    return call("os", "platform");
}

export function homedir(): string {
    return call("os", "homedir");
}

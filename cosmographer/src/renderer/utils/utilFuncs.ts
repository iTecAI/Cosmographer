import { join } from "path";
import { homedir, platform } from "./ipc/os";
import { exists, mkdir } from "./ipc/fs";

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

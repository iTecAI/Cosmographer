const expose: {
    call: (module: "fs" | "dialog", member: string, args?: any[]) => any;
    get: (module: "fs" | "dialog", member: string) => any;
} = (window as any).electron.expose;

function isError(o: any): o is { error: Error } {
    return o.error !== undefined && Object.keys(o).length === 1;
}

function call(module: "fs" | "dialog", member: string, args?: any[]): any {
    const result = expose.call(module, member, args);
    if (isError(result)) {
        throw result.error;
    }
    return result;
}

function get(module: "fs" | "dialog", member: string): any {
    const result = expose.get(module, member);
    if (isError(result)) {
        throw result.error;
    }
    return result;
}

export function readdir(
    path: string | Buffer | URL,
    options?: { encoding?: string }
): (string | Buffer)[] {
    return call("fs", "readdirSync", [path, options ?? {}]);
}

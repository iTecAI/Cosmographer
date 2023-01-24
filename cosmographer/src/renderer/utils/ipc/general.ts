export const expose: {
    call: (module: "fs" | "dialog" | "os", member: string, args?: any[]) => any;
    get: (module: "fs" | "dialog" | "os", member: string) => any;
    watch: (
        path: string,
        listener: (event: string, filename: string) => void
    ) => void;
    removeWatch: (path: string) => void;
} = (window as any).electron.expose;

function isError(o: any): o is { error: Error } {
    return o.error !== undefined && Object.keys(o).length === 1;
}

export function call(
    module: "fs" | "dialog" | "os",
    member: string,
    args?: any[]
): any {
    const result = expose.call(module, member, args);
    if (isError(result)) {
        throw result.error;
    }
    return result;
}

export function get(module: "fs" | "dialog" | "os", member: string): any {
    const result = expose.get(module, member);
    if (isError(result)) {
        throw result.error;
    }
    return result;
}

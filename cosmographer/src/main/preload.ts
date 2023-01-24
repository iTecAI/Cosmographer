import { contextBridge, ipcRenderer } from "electron";

const electronHandler = {
    expose: {
        call(module: "fs" | "dialog" | "os", member: string, args?: any[]) {
            return ipcRenderer.sendSync(
                "cosm-call",
                module,
                member,
                args ?? []
            );
        },
        get(module: "fs" | "dialog" | "os", member: string) {
            return ipcRenderer.sendSync("cosm-get", module, member);
        },
        watch(
            path: string,
            listener: (event: string, filename: string) => void
        ) {
            ipcRenderer.send("cosm-watch", path);
            ipcRenderer.on(
                `cosm-watch-update:${path}`,
                (event, eventType: string, filename: string) =>
                    listener(eventType, filename)
            );
        },
        removeWatch(path: string) {
            ipcRenderer.removeAllListeners(`cosm-watch-update:${path}`);
        },
    },
};

contextBridge.exposeInMainWorld("electron", electronHandler);

export type ElectronHandler = typeof electronHandler;

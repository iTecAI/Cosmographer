import { contextBridge, ipcRenderer } from "electron";

const electronHandler = {
    expose: {
        call(module: "fs" | "dialog", member: string, args?: any[]) {
            return ipcRenderer.sendSync(
                "cosm-call",
                module,
                member,
                args ?? []
            );
        },
        get(module: "fs" | "dialog", member: string) {
            return ipcRenderer.sendSync("cosm-get", module, member);
        },
    },
};

contextBridge.exposeInMainWorld("electron", electronHandler);

export type ElectronHandler = typeof electronHandler;

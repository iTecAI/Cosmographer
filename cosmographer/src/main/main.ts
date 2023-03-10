/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from "path";
import { app, BrowserWindow, shell, ipcMain, dialog } from "electron";
import { autoUpdater } from "electron-updater";
import log from "electron-log";
import MenuBuilder from "./menu";
import { resolveHtmlPath } from "./util";
import * as fs from "fs";
import * as os from "os";

class AppUpdater {
    constructor() {
        log.transports.file.level = "info";
        autoUpdater.logger = log;
        autoUpdater.checkForUpdatesAndNotify();
    }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === "production") {
    const sourceMapSupport = require("source-map-support");
    sourceMapSupport.install();
}

const isDebug =
    process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true";

if (isDebug) {
    require("electron-debug")();
}

const installExtensions = async () => {
    const installer = require("electron-devtools-installer");
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ["REACT_DEVELOPER_TOOLS"];

    return installer
        .default(
            extensions.map((name) => installer[name]),
            forceDownload
        )
        .catch(console.log);
};

const createWindow = async () => {
    if (isDebug) {
        await installExtensions();
    }

    const RESOURCES_PATH = app.isPackaged
        ? path.join(process.resourcesPath, "assets")
        : path.join(__dirname, "../../assets");

    const getAssetPath = (...paths: string[]): string => {
        return path.join(RESOURCES_PATH, ...paths);
    };

    mainWindow = new BrowserWindow({
        show: false,
        width: 1024,
        height: 728,
        icon: getAssetPath("icon.png"),
        webPreferences: {
            preload: app.isPackaged
                ? path.join(__dirname, "preload.js")
                : path.join(__dirname, "../../.erb/dll/preload.js"),
            nodeIntegration: true,
            nodeIntegrationInWorker: true
        },
    });

    mainWindow.loadURL(resolveHtmlPath("index.html"));

    mainWindow.on("ready-to-show", () => {
        if (!mainWindow) {
            throw new Error('"mainWindow" is not defined');
        }
        if (process.env.START_MINIMIZED) {
            mainWindow.minimize();
        } else {
            mainWindow.show();
        }
    });

    mainWindow.on("closed", () => {
        mainWindow = null;
    });

    /*const menuBuilder = new MenuBuilder(mainWindow);
    menuBuilder.buildMenu();*/
    mainWindow.menuBarVisible = false;

    // Open urls in the user's browser
    mainWindow.webContents.setWindowOpenHandler((edata) => {
        shell.openExternal(edata.url);
        return { action: "deny" };
    });

    // Remove this if your app does not use auto updates
    // eslint-disable-next-line
    //new AppUpdater();

    ipcMain.on("cosm-watch", async (event, path: string) => {
        fs.watch(path, { encoding: "utf8" }, (event, filename) => {
            if (mainWindow) {
                mainWindow.webContents.send(
                    `cosm-watch-update:${path}`,
                    event,
                    filename
                );
            }
        });
    });

    const OTHER_CMDS: {[key: string]: (bwindow: BrowserWindow, ...args: any[]) => any} = {
        "devtools": (bw) => bw.webContents.openDevTools(),
        "close": (bw) => bw.close(),
        "minimize": (bw) => bw.minimize(),
        "maximize": (bw) => bw.maximize(),
        "canMinimize": (bw) => bw.minimizable,
        "canMaximize": (bw) => bw.maximizable
    }

    ipcMain.on(
        "cosm-call",
        async (
            event,
            module: "fs" | "dialog" | "os" | "other",
            member: string,
            args: any[]
        ) => {
            try {
                switch (module) {
                    case "fs":
                        if (member === "lstatSync") {
                            const result = (fs as any)[member](...args);
                            result.directory = result.isDirectory();
                            result.file = result.isFile();
                            event.returnValue = result;
                        } else {
                            event.returnValue = (fs as any)[member](...args);
                        }

                    case "dialog":
                        event.returnValue = (dialog as any)[member](...args);
                    case "os":
                        event.returnValue = (os as any)[member](...args);
                    case "other":
                        if (mainWindow) {
                            event.returnValue = OTHER_CMDS[member](mainWindow, ...args);
                        } else {
                            event.returnValue = null;
                        }
                    default:
                        event.returnValue = {
                            error: `${module} is not recognized`,
                        };
                }
            } catch (err) {
                event.returnValue = { error: err };
            }
        }
    );

    ipcMain.on(
        "cosm-get",
        async (event, module: "fs" | "dialog" | "os" | "other", member: string) => {
            try {
                switch (module) {
                    case "fs":
                        event.returnValue = (fs as any)[member];
                    case "dialog":
                        event.returnValue = (dialog as any)[member];
                    case "os":
                        event.returnValue = (os as any)[member];
                    case "other":
                        if (mainWindow) {
                            event.returnValue = OTHER_CMDS[member](mainWindow);
                        } else {
                            event.returnValue = null;
                        }
                    default:
                        event.returnValue = {
                            error: `${module} is not recognized`,
                        };
                }
            } catch (err) {
                event.returnValue = { error: err };
            }
        }
    );
};

/**
 * Add event listeners...
 */

app.on("window-all-closed", () => {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.whenReady()
    .then(() => {
        createWindow();
        app.on("activate", () => {
            // On macOS it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (mainWindow === null) createWindow();
        });
    })
    .catch(console.log);

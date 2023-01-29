import { join } from "path";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { PluginManifest } from "renderer/types/plugins/plugins";
import { exists, readdir } from "./ipc/fs";
import { dataDirectory, loadIncludeJson } from "./utilFuncs";

const PluginContext = createContext<{ [key: string]: PluginManifest }>({});

export function PluginContextProvider(props: {
    children: ReactNode | ReactNode[];
}) {
    const [plugins, setPlugins] = useState<{ [key: string]: PluginManifest }>(
        {}
    );

    useMemo(() => {
        const pluginPaths: string[] = [];
        if (exists("plugins")) {
            pluginPaths.push(
                ...(readdir("plugins", { encoding: "utf-8" }) as string[]).map(
                    (v) => join("plugins", v, "manifest.cosm.json")
                )
            );
        }

        if (exists(join(dataDirectory(), "plugins"))) {
            pluginPaths.push(
                ...(
                    readdir(join(dataDirectory(), "plugins"), {
                        encoding: "utf-8",
                    }) as string[]
                ).map((v) =>
                    join(dataDirectory(), "plugins", v, "manifest.cosm.json")
                )
            );
        }

        const newPlugins: { [key: string]: PluginManifest } = {};
        for (const path of pluginPaths) {
            try {
                const cplug: PluginManifest = loadIncludeJson({ path });
                newPlugins[cplug.identifier] = cplug;
            } catch (e) {
                console.warn(`Failed to load plugin at ${path}`, e);
            }
        }
        setPlugins(newPlugins);
    }, []);

    return (
        <PluginContext.Provider value={plugins}>
            {props.children}
        </PluginContext.Provider>
    );
}

export function usePlugins(): { [key: string]: PluginManifest } {
    const pcon = useContext(PluginContext);
    return pcon;
}

import { join } from "path";
import { createContext, ReactNode, useState } from "react";
import { PluginManifest } from "renderer/types/plugins/plugins";
import { exists, readdir } from "./ipc/fs";
import { dataDirectory } from "./utilFuncs";

const PluginContext = createContext<{ [key: string]: PluginManifest }>({});

export function PluginContextProvider(props: {
    children: ReactNode | ReactNode[];
}) {
    const [plugins, setPlugins] = useState<{ [key: string]: PluginManifest }>(
        {}
    );

    const pluginPaths: string[] = [];
    if (exists("plugins")) {
        pluginPaths.push(
            ...(readdir("plugins", { encoding: "utf-8" }) as string[])
        );
    }

    if (exists(join(dataDirectory(), "plugins"))) {
        pluginPaths.push(
            ...(readdir(join(dataDirectory(), "plugins"), {
                encoding: "utf-8",
            }) as string[])
        );
    }
}

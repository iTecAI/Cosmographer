import { CosmRenderer } from "./renderTypes";

export type PluginType = "document";

export type PluginDocument = {
    slug: string;
    name: string;
    description: string;
    renderer: CosmRenderer;
}

export type PluginManifest = {
    identifier: string;
    displayName: string;
    description: string;
    author: string;
    source: string;
    types: PluginType[];
    document?: {[key: string]: PluginDocument};
}
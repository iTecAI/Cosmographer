export type PluginType = "document";

export type PluginManifest = {
    identifier: string;
    displayName: string;
    description: string;
    types: PluginType[];
}
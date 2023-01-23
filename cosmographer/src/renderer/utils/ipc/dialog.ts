import { call, get } from "./general";

type OpenDialogOptions = {
    title?: string;
    defaultPath?: string;
    buttonLabel?: string;
    filters?: {
        name: string;
        extensions: string[];
    };
    properties?: (
        | "openFile"
        | "openDirectory"
        | "multiSelections"
        | "showHiddenFiles"
        | "createDirectory"
        | "promptToCreate"
        | "noResolveAliases"
        | "treatPackageAsDirectory"
        | "dontAddToRecent"
    )[];
    message?: string;
    securityScopedBookmarks?: boolean;
};

export async function showOpenDialog(
    options?: OpenDialogOptions
): Promise<{ canceled: boolean; filePaths: string[]; bookmarks?: string[] }> {
    const result = call("dialog", "showOpenDialogSync", [options]);
    return result;
}

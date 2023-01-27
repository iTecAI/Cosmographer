export type UserConfig = {
    theme: "dark" | "light";
    recent: string[];
};

export const DEFAULT_CONFIG: Partial<UserConfig> = {
    theme: "dark",
    recent: []
};
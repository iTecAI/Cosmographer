import { ThemeConfig } from "antd/es/config-provider/context";
import { theme } from "antd";
import { ThemeDefaultToken } from "./defaults";

export const ThemeDark: ThemeConfig = {
    token: {
        colorPrimary: "#b751b5",
        ...ThemeDefaultToken,
    },
    algorithm: theme.darkAlgorithm,
};

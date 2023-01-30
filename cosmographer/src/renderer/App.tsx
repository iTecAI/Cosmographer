import { CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect } from "react";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";
import { CurrentProjectPage } from "./pages/currentProject";
import { CosmLayout } from "./pages/layout/layout";
import { ProjectsPage } from "./pages/projects";
import { themeDefault } from "./theme/default";
import { themeLight } from "./theme/light";
import { GlobalStateProvider } from "./utils/globalState";
import { LocalizationProvider } from "./utils/LocalizationProvider";
import { PluginContextProvider } from "./utils/plugins";
import { useConfig, UserConfigProvider } from "./utils/userConfig";
import { WatchProvider } from "./utils/WatchProvider";

function ThemeSystem() {
    const [conf] = useConfig();
    return (
        <ThemeProvider
            theme={conf.theme === "light" ? themeLight : themeDefault}
        >
            <CssBaseline enableColorScheme />
            <Router>
                <Routes>
                    <Route path="/" element={<CosmLayout />}>
                        <Route index element={<ProjectsPage />} />
                        <Route path="/proj" element={<CurrentProjectPage />} />
                    </Route>
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default function App() {
    return (
        <WatchProvider>
            <UserConfigProvider>
                <PluginContextProvider>
                    <LocalizationProvider language="en">
                        <GlobalStateProvider>
                            <ThemeSystem />
                        </GlobalStateProvider>
                    </LocalizationProvider>
                </PluginContextProvider>
            </UserConfigProvider>
        </WatchProvider>
    );
}

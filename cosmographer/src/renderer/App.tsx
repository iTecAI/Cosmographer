import { CssBaseline, ThemeProvider } from "@mui/material";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";
import { CosmLayout } from "./pages/layout/layout";
import { ProjectsPage } from "./pages/projects";
import { themeDefault } from "./theme/default";
import { themeLight } from "./theme/light";
import { DBContextProvider } from "./utils/database";
import { LocalizationProvider } from "./utils/LocalizationProvider";
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
                    </Route>
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default function App() {
    return (
        <WatchProvider>
            <DBContextProvider>
                <UserConfigProvider>
                    <LocalizationProvider language="en">
                        <ThemeSystem />
                    </LocalizationProvider>
                </UserConfigProvider>
            </DBContextProvider>
        </WatchProvider>
    );
}

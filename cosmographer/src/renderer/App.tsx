import { CssBaseline, ThemeProvider } from "@mui/material";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";
import { CosmLayout } from "./pages/layout/layout";
import { ProjectsPage } from "./pages/projects";
import { themeDefault } from "./theme/default";
import { DBContextProvider } from "./utils/database";
import { LocalizationProvider } from "./utils/LocalizationProvider";
import { UserConfigProvider } from "./utils/userConfig";
import { WatchProvider } from "./utils/WatchProvider";

export default function App() {
    return (
        <ThemeProvider theme={themeDefault}>
            <CssBaseline enableColorScheme />
            <WatchProvider>
                <DBContextProvider>
                    <UserConfigProvider>
                        <LocalizationProvider language="en">
                            <Router>
                                <Routes>
                                    <Route path="/" element={<CosmLayout />}>
                                        <Route
                                            index
                                            element={<ProjectsPage />}
                                        />
                                    </Route>
                                </Routes>
                            </Router>
                        </LocalizationProvider>
                    </UserConfigProvider>
                </DBContextProvider>
            </WatchProvider>
        </ThemeProvider>
    );
}

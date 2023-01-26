import { ConfigProvider } from "antd";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";
import { CosmLayout } from "./pages/layout/layout";
import { ProjectsPage } from "./pages/projects";
import { ThemeDark } from "./themes/dark";
import { DBContextProvider } from "./utils/database";
import { LocalizationProvider } from "./utils/LocalizationProvider";
import { UserConfigProvider } from "./utils/userConfig";
import { WatchProvider } from "./utils/WatchProvider";

export default function App() {
    return (
        <WatchProvider>
            <DBContextProvider>
                <UserConfigProvider>
                    <ConfigProvider theme={ThemeDark}>
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
                    </ConfigProvider>
                </UserConfigProvider>
            </DBContextProvider>
        </WatchProvider>
    );
}

import { ConfigProvider } from "antd";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";
import { CosmLayout } from "./pages/layout/layout";
import { ProjectsPage } from "./pages/projects";
import { ThemeDark } from "./themes/dark";
import { LocalizationProvider } from "./utils/LocalizationProvider";
import { useEffect } from "react";

export default function App() {
    return (
        <ConfigProvider theme={ThemeDark}>
            <LocalizationProvider language="en">
                <Router>
                    <Routes>
                        <Route path="/" element={<CosmLayout />}>
                            <Route index element={<ProjectsPage />} />
                        </Route>
                    </Routes>
                </Router>
            </LocalizationProvider>
        </ConfigProvider>
    );
}

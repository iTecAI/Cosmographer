import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";
import React, { useEffect } from "react";
import { readdir } from "./utils/ipc/fs";

export default function App() {
    useEffect(() => {
        console.log(readdir("."));
    }, []);
    return (
        <Router>
            <Routes>
                <Route path="/" element={<></>} />
            </Routes>
        </Router>
    );
}

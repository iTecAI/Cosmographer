import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<></>} />
            </Routes>
        </Router>
    );
}

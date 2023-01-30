import { Outlet } from "react-router-dom";
import "./layout.scss";

export function CosmLayout() {
    return (
        <div className="layout-main">
            <Outlet />
        </div>
    );
}

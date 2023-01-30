import { Outlet } from "react-router-dom";
import "./layout.scss";
import { useTranslation } from "../../utils/LocalizationProvider";
import { useGlobal } from "renderer/utils/globalState";
import { useEffect } from "react";

export function CosmLayout() {
    const t = useTranslation();
    const p = useGlobal("project");
    useEffect(() => {
        console.log(p);
    }, [p]);
    return (
        <div className="layout-main">
            <Outlet />
        </div>
    );
}

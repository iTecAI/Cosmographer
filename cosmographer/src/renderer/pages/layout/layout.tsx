import { Outlet } from "react-router-dom";
import "./layout.scss";
import Icon from "../../resources/assets/icon.png";
import { useTranslation } from "../../utils/LocalizationProvider";

export function CosmLayout() {
    const t = useTranslation();
    return (
        <div className="layout-main">
            <Outlet />
        </div>
    );
}

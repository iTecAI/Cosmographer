import { Card, Space } from "antd";
import Icon from "../../resources/assets/icon.png";
import "./index.scss";

export function ProjectsPage() {
    return (
        <Space direction="vertical" className="project-menu-root">
            <img src={Icon} className="icon" />
            <Card className="content project-menu"></Card>
        </Space>
    );
}

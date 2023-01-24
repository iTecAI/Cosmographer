import { Button, Card, Space, Typography } from "antd";
import Icon from "../../resources/assets/icon.png";
import "./index.scss";
import { useTranslation } from "../../utils/LocalizationProvider";

export function ProjectsPage() {
    const t = useTranslation();
    return (
        <Space direction="vertical" className="project-menu-root">
            <img src={Icon} className="icon" />
            <Typography.Title level={2} className="app-name">
                {t("name")}
            </Typography.Title>
            <Space
                className="content project-menu"
                direction="vertical"
                size="large"
            >
                <Button
                    type="default"
                    block
                    size="large"
                    className="action create"
                >
                    {t("project.create")}
                </Button>
                <Button
                    type="default"
                    block
                    size="large"
                    className="action load"
                >
                    {t("project.load")}
                </Button>
            </Space>
        </Space>
    );
}

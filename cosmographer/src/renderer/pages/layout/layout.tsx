import { Layout, Space, theme } from "antd";
import { Outlet } from "react-router-dom";
import "./layout.scss";
import Icon from "../../resources/assets/icon.png";
import { useTranslation } from "../../utils/LocalizationProvider";
import { useWatch } from "renderer/utils/WatchProvider";
import { useEffect } from "react";
import { useConfig } from "renderer/utils/userConfig";

const { Content, Header } = Layout;

export function CosmLayout() {
    const { token } = theme.useToken();
    const t = useTranslation();
    const conf = useConfig();
    useEffect(() => {
        console.log(conf);
    }, [conf]);
    return (
        <Layout className="app-layout">
            <Header
                className="app-header"
                style={{
                    backgroundColor: token.colorBgContainer,
                }}
            >
                <Space direction="horizontal">
                    <img src={Icon} />
                </Space>
            </Header>
            <Content className="app-content">
                <Outlet />
            </Content>
        </Layout>
    );
}

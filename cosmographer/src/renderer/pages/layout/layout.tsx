import { Layout, Space, theme } from "antd";
import { Outlet } from "react-router-dom";
import "./layout.scss";
import Icon from "../../resources/assets/icon.png";
import { useTranslation } from "../../utils/LocalizationProvider";

const { Content, Header } = Layout;

export function CosmLayout() {
    const { token } = theme.useToken();
    const t = useTranslation();
    return (
        <Layout className="app-layout">
            <Header
                className="app-header"
                style={{
                    backgroundColor: token.colorBgElevated,
                    boxShadow: token.boxShadow
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

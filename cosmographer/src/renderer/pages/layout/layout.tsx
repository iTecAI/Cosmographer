import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import "./layout.scss";

const { Content } = Layout;

export function CosmLayout() {
    return (
        <Layout className="app-layout">
            <Content className="app-content">
                <Outlet />
            </Content>
        </Layout>
    );
}

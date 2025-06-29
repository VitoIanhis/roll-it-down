"use client";

import React, { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { FaDiceD20 } from "react-icons/fa";

import { Button, Layout, Menu, theme } from "antd";

const { Header, Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const image = collapsed ? "icon.svg" : "logo.svg";

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
        <div className="logo">
          <Image
            src={`/assets/${image}`}
            width={collapsed ? 50 : 126}
            height={collapsed ? 30 : 50}
            alt="Logo tradeview"
          />
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <FaDiceD20 />,
              label: "nav 1",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          Content
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;

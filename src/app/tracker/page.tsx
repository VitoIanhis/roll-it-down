"use client";
import React, { useState, useEffect } from "react";
import { LuSwords } from "react-icons/lu";
import {
  TbLayoutSidebarRightCollapse,
  TbLayoutSidebarLeftCollapse,
} from "react-icons/tb";

import { Button, Layout, Menu, theme, Spin } from "antd";
import Image from "next/image";
import "./page.css";
import EditableTable from "./components/EditableTable";

const { Sider, Content } = Layout;

type MenuItem = {
  key: string;
  icon: React.ReactNode;
  label: React.ReactNode;
  children?: { key: string; label: string }[];
};

const Tracker: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("1");
  const {
    token: { borderRadiusLG },
  } = theme.useToken();
  const [loading, setLoading] = useState(true);

  const image = collapsed ? "icon.svg" : "logo.svg";

  const menuItems: MenuItem[] = [
    {
      key: "1",
      icon: <LuSwords />,
      label: <span className="logo-font">Oráculo de Combate</span>,
    },
  ];

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 9999,
          background: "rgba(28, 43, 74, 0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout
      style={{ minHeight: "100vh", backgroundColor: "#1C2B4A" }}
      className="gap-5 pt-5 pl-5 pb-5 pr-5"
    >
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        className="rounded-xl p-1"
        style={{ backgroundColor: "#F5F5DC" }}
      >
        <div className="flex justify-center items-center p-4">
          <Image
            src={`/assets/${image}`}
            width={collapsed ? 50 : 110}
            height={collapsed ? 30 : 50}
            alt="Logo"
            style={{ filter: "drop-shadow(0 2px 4px rgba(28, 43, 74, 0.3))" }}
          />
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[selectedKey]}
          className="rounded-xl"
        >
          {menuItems.map((item) =>
            item?.children ? (
              <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
                {item?.children.map((child) => (
                  <Menu.Item
                    key={child.key}
                    onClick={() => setSelectedKey(child.key)}
                  >
                    {child.label}
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            ) : (
              <Menu.Item
                key={item.key}
                icon={item.icon}
                onClick={() => setSelectedKey(item.key)}
              >
                {item.label}
              </Menu.Item>
            )
          )}
        </Menu>
      </Sider>
      <Layout className="rounded-xl">
        <Content
          style={{
            background: "#F5F5DC",
            borderRadius: borderRadiusLG,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            minHeight: "80vh",
            paddingTop: 0,
          }}
        >
          <div className="absolute top-6 left-6 z-10">
            <Button
              type="text"
              icon={
                collapsed ? (
                  <TbLayoutSidebarRightCollapse />
                ) : (
                  <TbLayoutSidebarLeftCollapse />
                )
              }
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "30px",
                backgroundColor: "#F5F5DC",
              }}
            />
          </div>
          <div className="flex flex-col items-center mt-6 mb-8">
            <Image
              src={`/assets/logo.svg`}
              width={110}
              height={70}
              alt="Logo"
              style={{ filter: "drop-shadow(0 2px 4px rgba(28, 43, 74, 0.3))" }}
            />
            <span
              className="mt-2 text-center text-xs italic font-medium"
              style={{
                textShadow: "0 2px 4px rgba(28, 43, 74, 0.15)",
                letterSpacing: "0.5px",
              }}
            >
              De jogador para jogador. Feito pra quem vive cada sessão.
            </span>
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <EditableTable />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Tracker;

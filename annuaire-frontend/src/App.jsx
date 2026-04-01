// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { BuildOutlined, SettingOutlined } from '@ant-design/icons';
import AnnuairePage from './pages/AnnuairePage';
import AdminDashboard from './pages/AdminDashboard';
import 'antd/dist/reset.css';

const { Header, Content, Footer } = Layout;

export default function App() {
  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>

        {/* ── Barre de navigation ── */}
        <Header style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold',
            marginRight: 40
          }}>
            🏢 Annuaire Sociétés
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['annuaire']}
            items={[
              {
                key: 'annuaire',
                icon: <BuildOutlined />,
                label: <Link to="/">Annuaire</Link>,
              },
              {
                key: 'admin',
                icon: <SettingOutlined />,
                label: <Link to="/admin">Administration</Link>,
              },
            ]}
          />
        </Header>

        {/* ── Contenu principal ── */}
        <Content style={{ padding: '24px', background: '#f5f5f5' }}>
          <Routes>
            <Route path="/"      element={<AnnuairePage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </Content>

        {/* ── Footer ── */}
        <Footer style={{ textAlign: 'center' }}>
          Annuaire Sociétés Tunisie — Projet ING A2 © 2026
        </Footer>

      </Layout>
    </BrowserRouter>
  );
}
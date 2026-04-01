// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Table, Button, Popconfirm, Tag,
  Card, Row, Col, Statistic,
  message, Typography, Space, Badge
} from 'antd';
import {
  DeleteOutlined, EditOutlined,
  BuildOutlined, EnvironmentOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { getCompanies, deleteCompany, getStats } from '../api/companyApi';

const { Title } = Typography;

export default function AdminDashboard() {
  const [companies, setCompanies] = useState([]);
  const [stats, setStats]         = useState({});
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [companiesRes, statsRes] = await Promise.all([
        getCompanies(),
        getStats()
      ]);
      setCompanies(companiesRes.data);
      setStats(statsRes.data);
    } catch (err) {
      message.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCompany(id);
      message.success('✅ Entreprise supprimée');
      loadData();
    } catch {
      message.error('❌ Erreur lors de la suppression');
    }
  };

  const columns = [
    {
      title: 'Nom',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Ville',
      dataIndex: 'city',
      key: 'city',
      render: (city) => (
        <Space>
          <EnvironmentOutlined />
          {city}
        </Space>
      )
    },
    {
      title: 'Services',
      dataIndex: 'services',
      key: 'services',
      render: (services) => services
        ? services.split(',').slice(0, 2).map(s => (
            <Tag key={s} color="processing">{s.trim()}</Tag>
          ))
        : '-'
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge
          status={status === 'ACTIVE' ? 'success' : 'default'}
          text={status}
        />
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
          >
            Modifier
          </Button>
          <Popconfirm
            title="Supprimer cette entreprise ?"
            description="Cette action est irréversible."
            onConfirm={() => handleDelete(record.id)}
            okText="Oui, supprimer"
            cancelText="Annuler"
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              Supprimer
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <Space style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          ⚙️ Dashboard Administrateur
        </Title>
        <Button
          icon={<ReloadOutlined />}
          onClick={loadData}
          loading={loading}
        >
          Actualiser
        </Button>
      </Space>

      {/* ── Statistiques ── */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Entreprises"
              value={stats.total || 0}
              prefix={<BuildOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Actives"
              value={companies.filter(c => c.status === 'ACTIVE').length}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Villes couvertes"
              value={new Set(companies.map(c => c.city)).size}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Source"
              value="TechBehemoths"
              valueStyle={{ fontSize: 14 }}
            />
          </Card>
        </Col>
      </Row>

      {/* ── Table ── */}
      <Card title="📋 Liste des entreprises">
        <Table
          dataSource={companies}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10, showTotal: (t) => `${t} entreprises` }}
        />
      </Card>
    </div>
  );
}

// Import manquant — ajoute en haut du fichier
const { Text } = Typography;
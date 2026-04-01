// src/pages/AnnuairePage.jsx
import React, { useState, useEffect } from 'react';
import {
  Input, Select, Card, Row, Col,
  Tag, Spin, Empty, Typography, Space, Badge
} from 'antd';
import { SearchOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { getCompanies } from '../api/companyApi';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const VILLES = [
  'Tunis', 'Sfax', 'Ariana', 'Sousse',
  'Kairouan', 'Manouba', 'Bizerte'
];

export default function AnnuairePage() {
  const [companies, setCompanies]   = useState([]);
  const [loading, setLoading]       = useState(false);
  const [searchName, setSearchName] = useState('');
  const [filterCity, setFilterCity] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCompanies();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchName, filterCity]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await getCompanies(searchName, filterCity);
      setCompanies(res.data);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>

      {/* ── En-tête ── */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>🏢 Annuaire des Sociétés</Title>
        <Paragraph type="secondary">
          Découvrez les entreprises tech en Tunisie
        </Paragraph>
      </div>

      {/* ── Filtres ── */}
      <Space style={{ marginBottom: 24, width: '100%' }} wrap>
        <Input
          placeholder="🔍 Rechercher une entreprise..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={{ width: 300 }}
          allowClear
          prefix={<SearchOutlined />}
        />
        <Select
          placeholder="📍 Filtrer par ville"
          value={filterCity || undefined}
          onChange={(val) => setFilterCity(val || '')}
          style={{ width: 200 }}
          allowClear
        >
          {VILLES.map(v => (
            <Option key={v} value={v}>{v}</Option>
          ))}
        </Select>
        <Text type="secondary">
          <Badge count={companies.length} color="blue" /> résultat(s)
        </Text>
      </Space>

      {/* ── Résultats ── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 80 }}>
          <Spin size="large" tip="Chargement..." />
        </div>
      ) : companies.length === 0 ? (
        <Empty description="Aucune entreprise trouvée" />
      ) : (
        <Row gutter={[16, 16]}>
          {companies.map(company => (
            <Col xs={24} sm={12} lg={8} key={company.id}>
              <CompanyCard company={company} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

// ── Composant carte entreprise ────────────────────────────────
function CompanyCard({ company }) {
  const services = company.services
    ? company.services.split(',').slice(0, 3)
    : [];

  return (
    <Card
      hoverable
      style={{ height: '100%', borderRadius: 12 }}
      styles={{ body: { padding: 20 } }}
    >
      {/* Nom */}
      <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 6 }}>
        {company.name}
      </Text>

      {/* Ville */}
      <Space style={{ marginBottom: 10 }}>
        <EnvironmentOutlined style={{ color: '#1677ff' }} />
        <Text type="secondary">{company.city}, {company.country}</Text>
      </Space>

      {/* Description */}
      <Paragraph
        ellipsis={{ rows: 2 }}
        type="secondary"
        style={{ fontSize: 13, marginBottom: 12 }}
      >
        {company.description || 'Aucune description disponible'}
      </Paragraph>

      {/* Services */}
      <div>
        {services.map(s => (
          <Tag key={s} color="blue" style={{ marginBottom: 4 }}>
            {s.trim()}
          </Tag>
        ))}
      </div>
    </Card>
  );
}
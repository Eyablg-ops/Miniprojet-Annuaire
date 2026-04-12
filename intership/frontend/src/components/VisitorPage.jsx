import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Row, Col, Statistic, Typography, Space, ConfigProvider } from 'antd';
import { 
  UserOutlined, 
  BuildOutlined, 
  RocketOutlined, 
  TeamOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import '../styles/VisitorPage.css';

const { Title, Text, Paragraph } = Typography;

const VisitorPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <ThunderboltOutlined style={{ fontSize: '3rem', color: '#1890ff' }} />,
      title: "Matching Intelligent",
      description: "Recommandations basées sur l'IA pour trouver le stage parfait selon votre profil"
    },
    {
      icon: <CheckCircleOutlined style={{ fontSize: '3rem', color: '#52c41a' }} />,
      title: "Suivi de Progression",
      description: "Suivez vos candidatures et votre parcours de stage en temps réel"
    },
    {
      icon: <TeamOutlined style={{ fontSize: '3rem', color: '#faad14' }} />,
      title: "Connexion Directe",
      description: "Connectez-vous directement avec les recruteurs et les entreprises"
    },
    {
      icon: <GlobalOutlined style={{ fontSize: '3rem', color: '#eb2f96' }} />,
      title: "Développement de Carrière",
      description: "Accédez aux ressources et insights pour votre développement professionnel"
    }
  ];

  const stats = [
    { value: 500, suffix: '+', title: 'Entreprises partenaires', prefix: <BuildOutlined /> },
    { value: 10000, suffix: '+', title: 'Étudiants inscrits', prefix: <UserOutlined /> },
    { value: 2000, suffix: '+', title: 'Stages proposés', prefix: <RocketOutlined /> }
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 12,
        },
      }}
    >
      <div className="visitor-container">
        {/* Navigation */}
        <nav className="visitor-nav">
          <div className="nav-brand">
            <img src="/images/issat.jpg" alt="ISSAT Sousse" className="issat-logo" />
            <div className="brand-text">
              <span className="brand-name">ISSAT Sousse</span>
              <span className="brand-subtitle">Plateforme de Stages</span>
            </div>
          </div>
          <Button 
            type="primary" 
            size="large"
            className="nav-login-btn"
            onClick={() => navigate('/login')}
          >
            Se connecter
          </Button>
        </nav>

        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <div className="issat-badge">
              <img src="/images/issat.jpg" alt="ISSAT" className="issat-badge-icon" />
              <span>Institut Supérieur des Sciences Appliquées et de Technologie de Sousse</span>
            </div>
            
            <Title level={1} className="hero-title">
              Trouvez Votre
              <span className="gradient-text"> Stage Parfait</span>
            </Title>
            
            <Paragraph className="hero-subtitle">
              Connectez-vous avec les meilleures entreprises et lancez votre carrière.
              Que vous soyez étudiant à la recherche d'opportunités ou une entreprise 
              à la recherche de talents, nous vous accompagnons.
            </Paragraph>
            
            <Space size="large" className="cta-buttons">
              <Button 
                type="primary"
                size="large"
                className="cta-btn student-btn"
                onClick={() => navigate('/signup/student')}
                icon={<UserOutlined />}
              >
                Je suis étudiant
              </Button>
              <Button 
                size="large"
                className="cta-btn recruiter-btn"
                onClick={() => navigate('/signup/recruiter')}
                icon={<BuildOutlined />}
              >
                Je suis recruteur
              </Button>
            </Space>
          </div>

          {/* Stats Section */}
          <Row gutter={[24, 24]} className="stats-section" justify="center">
            {stats.map((stat, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <Card className="stat-card" bordered={false}>
                  <Statistic
                    value={stat.value}
                    suffix={stat.suffix}
                    title={stat.title}
                    prefix={stat.prefix}
                    valueStyle={{ color: '#1890ff', fontSize: '2rem', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <div className="section-header">
            <Title level={2} className="section-title">Pourquoi Choisir Notre Plateforme ?</Title>
            <Text type="secondary" className="section-subtitle">
              Une plateforme complète pour réussir votre insertion professionnelle
            </Text>
          </div>

          <Row gutter={[24, 24]} className="features-grid">
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card 
                  className="feature-card" 
                  bordered={false}
                  hoverable
                >
                  <div className="feature-icon">{feature.icon}</div>
                  <Title level={4} className="feature-title">{feature.title}</Title>
                  <Paragraph className="feature-description">{feature.description}</Paragraph>
                  <Button type="link" className="feature-link">
                    En savoir plus <ArrowRightOutlined />
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Call to Action */}
          <div className="cta-section">
            <Card className="cta-card">
              <Row align="middle" gutter={[24, 24]}>
                <Col xs={24} md={16}>
                  <Title level={3} style={{ margin: 0, color: '#fff' }}>
                    Prêt à commencer votre parcours ?
                  </Title>
                  <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
                    Rejoignez des milliers d'étudiants qui ont déjà trouvé leur stage idéal
                  </Text>
                </Col>
                <Col xs={24} md={8} style={{ textAlign: 'right' }}>
                  <Button 
                    type="primary" 
                    size="large"
                    className="cta-button"
                    onClick={() => navigate('/signup/student')}
                  >
                    S'inscrire maintenant
                  </Button>
                </Col>
              </Row>
            </Card>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default VisitorPage;
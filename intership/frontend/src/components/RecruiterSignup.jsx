import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Select, message, Typography, Row, Col } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined, BuildOutlined, IdcardOutlined } from '@ant-design/icons';
import axios from 'axios';
import '../styles/Signup.css';

const { Title, Text } = Typography;
const { Option } = Select;

const RecruiterSignup = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/public/companies');
      setCompanies(response.data);
    } catch (err) {
      console.error('Error fetching companies:', err);
      message.error('Impossible de charger la liste des entreprises');
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/auth/recruiter/register', values);
      console.log('Registration successful:', response.data);
      message.success('Compte recruteur créé avec succès ! Redirection vers la connexion...');
      
      setTimeout(() => {
        navigate('/login', { state: { fromSignup: true } });
      }, 1700);
      
    } catch (err) {
      message.error(err.response?.data || "Échec de l'inscription. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card recruiter-signup">
        <div className="signup-header">
          <div className="issat-logo-container">
            <img src="/images/issat.jpg" alt="ISSAT Sousse" className="issat-logo" />
          </div>
          <Title level={2} className="signup-title">
            Inscription Recruteur
          </Title>
          <Text type="secondary" className="signup-subtitle">
            Inscrivez votre entreprise et trouvez les meilleurs talents
          </Text>
        </div>

        <Form
          form={form}
          name="recruiter_signup"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="firstName"
                label="Prénom"
                rules={[{ required: true, message: 'Veuillez entrer votre prénom' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Prénom" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="lastName"
                label="Nom"
                rules={[{ required: true, message: 'Veuillez entrer votre nom' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Nom" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="email"
            label="Email professionnel"
            rules={[
              { required: true, message: 'Veuillez entrer votre email' },
              { type: 'email', message: 'Email invalide' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="nom@entreprise.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mot de passe"
            rules={[
              { required: true, message: 'Veuillez entrer votre mot de passe' },
              { min: 6, message: 'Le mot de passe doit contenir au moins 6 caractères' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mot de passe" />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="position" label="Poste">
                <Input prefix={<IdcardOutlined />} placeholder="DRH, Responsable recrutement..." />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="phone" label="Téléphone">
                <Input prefix={<PhoneOutlined />} placeholder="+216 XX XXX XXX" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="companyId"
            label="Sélectionnez votre entreprise"
            rules={[{ required: true, message: 'Veuillez sélectionner votre entreprise' }]}
          >
            <Select 
              placeholder="Choisissez votre entreprise"
              showSearch
              optionFilterProp="children"
              suffixIcon={<BuildOutlined />}
            >
              {companies.map(company => (
                <Option key={company.id} value={company.id}>
                  {company.name} - {company.city}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large" className="signup-btn">
              {loading ? 'Création du compte...' : 'Créer mon compte recruteur'}
            </Button>
          </Form.Item>

          <div className="signup-footer">
            <Text type="secondary">Vous avez déjà un compte ? </Text>
            <Link to="/login">Se connecter</Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RecruiterSignup;
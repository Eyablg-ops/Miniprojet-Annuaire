import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Select, DatePicker, message, Typography, Row, Col } from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  LockOutlined, 
  PhoneOutlined, 
  HomeOutlined,
  EnvironmentOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import axios from 'axios';
import '../styles/Signup.css';

const { Title, Text } = Typography;
const { Option } = Select;

const StudentSignup = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/auth/student/register', values);
      console.log('Registration successful:', response.data);
      message.success('Compte créé avec succès ! Redirection vers la connexion...');
      
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
      <div className="signup-card student-signup">
        <div className="signup-header">
          <div className="issat-logo-container">
            <img src="/images/issat.jpg" alt="ISSAT Sousse" className="issat-logo" />
          </div>
          <Title level={2} className="signup-title">
            Inscription Étudiant
          </Title>
          <Text type="secondary" className="signup-subtitle">
            Créez votre compte étudiant ISSAT Sousse
          </Text>
        </div>

        <Form
          form={form}
          name="student_signup"
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
            label="Email"
            rules={[
              { required: true, message: 'Veuillez entrer votre email' },
              { type: 'email', message: 'Email invalide' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="exemple@issatso.u-sousse.tn" />
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
              <Form.Item name="phone" label="Téléphone">
                <Input prefix={<PhoneOutlined />} placeholder="+216 XX XXX XXX" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="dateOfBirth" label="Date de naissance">
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="JJ/MM/AAAA" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="address" label="Adresse">
            <Input prefix={<HomeOutlined />} placeholder="Votre adresse" />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="educationLevel" label="Niveau d'études">
                <Select placeholder="Sélectionnez votre niveau">
                  <Option value="Bachelor">Licence</Option>
                  <Option value="Engineering">Ingénierie</Option>
                  <Option value="Master">Master</Option>
                  <Option value="PhD">Doctorat</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="major" label="Filière">
                <Input placeholder="Ex: Informatique, Génie Civil..." />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="university" label="Université">
                <Input prefix={<EnvironmentOutlined />} placeholder="ISSAT Sousse" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="graduationYear" label="Année de diplomation">
                <Select placeholder="Sélectionnez l'année">
                  <Option value={2021}>2021</Option>
                  <Option value={2022}>2022</Option>
                  <Option value={2023}>2023</Option>
                  <Option value={2024}>2024</Option>
                  <Option value={2025}>2025</Option>
                  <Option value={2026}>2026</Option>
                  <Option value={2027}>2027</Option>
                  <Option value={2028}>2028</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large" className="signup-btn">
              {loading ? 'Création du compte...' : 'Créer mon compte étudiant'}
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

export default StudentSignup;
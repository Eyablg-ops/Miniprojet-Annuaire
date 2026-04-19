import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message, Divider, Space } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import axios from 'axios';
import '../styles/AntLogin.css';

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (location.state?.fromSignup) {
      message.success('Compte créé avec succès ! Veuillez vous connecter.');
    }
  }, [location]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', values);
      const { token, userType, userId, email } = response.data;

      localStorage.clear();
      localStorage.setItem('token', token);
      localStorage.setItem('userType', userType);
      localStorage.setItem('userId', userId);
      localStorage.setItem('email', email);

      if (userType === 'STUDENT') {
        try {
          const studentResponse = await axios.get(
            `http://localhost:8080/api/student/email/${email}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          localStorage.setItem('studentId', studentResponse.data.id);
          message.success(`Bienvenue ${studentResponse.data.firstName} !`);
          navigate('/student/dashboard');
        } catch (err) {
          localStorage.setItem('studentId', userId);
          navigate('/student/dashboard');
        }
      } else if (userType === 'RECRUITER') {
        try {
          const recruiterRes = await axios.get(
            `http://localhost:8080/api/recruiters/me`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (recruiterRes.data?.company?.id) {
            localStorage.setItem('companyId', String(recruiterRes.data.company.id));
          }
          message.success('Connexion réussie !');
          navigate('/recruiter/dashboard');
        } catch (err) {
          navigate('/recruiter/dashboard');
        }
      } else if (userType === 'ADMIN') {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      message.error(err.response?.data || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ant-login-container">
      <div className="ant-login-background">
        <div className="animated-bg"></div>
      </div>
      <div className="ant-login-wrapper">
        <Card className="ant-login-card" bordered={false}>
          <div className="login-header">
            <div className="issat-brand">
              <img src="/images/issat.jpg" alt="ISSAT Sousse" className="issat-logo" />
              <div>
                <Title level={3} style={{ margin: 0, color: '#1890ff' }}>ISSAT Sousse</Title>
                <Text type="secondary">Plateforme de stages</Text>
              </div>
            </div>
            <Divider />
            <Title level={2} style={{ textAlign: 'center' }}>
              <LoginOutlined /> Connexion
            </Title>
            <Text type="secondary" style={{ display: 'block', textAlign: 'center' }}>
              Accédez à votre espace personnel
            </Text>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Veuillez entrer votre email' },
                { type: 'email', message: 'Email invalide' }
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Veuillez entrer votre mot de passe' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Mot de passe" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block size="large">
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              <Text type="secondary">Vous n'avez pas de compte ? </Text>
              <Link to="/signup/student">Inscrivez-vous</Link>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Typography, Spin, Empty, Button, Space, Modal, Descriptions } from 'antd';
import { EyeOutlined, FilePdfOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import '../../styles/MyApplications.css';

const { Title, Text } = Typography;

const MyApplications = ({ refreshTrigger }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [refreshTrigger]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/postulations/my', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        console.error('Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 'PENDING':
        return <Tag icon={<ClockCircleOutlined />} color="warning">Pending</Tag>;
      case 'ACCEPTED':
        return <Tag icon={<CheckCircleOutlined />} color="success">Accepted</Tag>;
      case 'REJECTED':
        return <Tag icon={<CloseCircleOutlined />} color="error">Rejected</Tag>;
      case 'REVIEWED':
        return <Tag icon={<EyeOutlined />} color="processing">Reviewed</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'PENDING': return 'status-pending';
      case 'ACCEPTED': return 'status-accepted';
      case 'REJECTED': return 'status-rejected';
      case 'REVIEWED': return 'status-reviewed';
      default: return '';
    }
  };

  const columns = [
    {
      title: 'Offer',
      dataIndex: 'offerTitle',
      key: 'offerTitle',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#666' }}>ID: {record.offerId}</div>
        </div>
      )
    },
    {
      title: 'Application Date',
      dataIndex: 'appliedAt',
      key: 'appliedAt',
      render: (text) => new Date(text).toLocaleDateString('en-US')
    },
    {
      title: 'Cover Letter',
      dataIndex: 'coverLetter',
      key: 'coverLetter',
      render: (text) => text ? (
        <div style={{ maxWidth: 200 }}>
          {text.length > 50 ? text.substring(0, 50) + '...' : text}
        </div>
      ) : <Text type="secondary">Not provided</Text>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status)
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            onClick={() => {
              setSelectedApp(record);
              setModalVisible(true);
            }}
          >
            Details
          </Button>
          {record.cvUrl && (
            <Button 
              type="link" 
              icon={<FilePdfOutlined />}
              onClick={() => window.open(`http://localhost:8080/api/postulations/fichier/${record.cvUrl}`, '_blank')}
            >
              CV
            </Button>
          )}
        </Space>
      )
    }
  ];

  if (loading) {
    return (
      <div className="student-section-card" style={{ textAlign: 'center', padding: '60px' }}>
        <Spin size="large" />
        <p style={{ marginTop: 20 }}>Loading your applications...</p>
      </div>
    );
  }

  return (
    <div className="student-section-card">
      <div className="sd-page-header">
        <Title level={2}>📋 My Applications</Title>
        <Text type="secondary">Track the status of your internship applications</Text>
      </div>

      {applications.length === 0 ? (
        <Empty 
          description="You haven't applied to any offers yet"
          style={{ padding: '40px' }}
        >
          <Button type="primary" onClick={() => window.location.href = '/student/dashboard?tab=offers'}>
            Browse Offers
          </Button>
        </Empty>
      ) : (
        <>
          <div className="applications-stats">
            <div className="stat-card">
              <div className="stat-number">{applications.length}</div>
              <div className="stat-label">Total Applications</div>
            </div>
            <div className="stat-card pending">
              <div className="stat-number">{applications.filter(a => a.status === 'PENDING').length}</div>
              <div className="stat-label">Pending</div>
            </div>
            <div className="stat-card accepted">
              <div className="stat-number">{applications.filter(a => a.status === 'ACCEPTED').length}</div>
              <div className="stat-label">Accepted</div>
            </div>
            <div className="stat-card rejected">
              <div className="stat-number">{applications.filter(a => a.status === 'REJECTED').length}</div>
              <div className="stat-label">Rejected</div>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={applications}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            className="applications-table"
          />
        </>
      )}

      <Modal
        title="Application Details"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>
        ]}
        width={700}
      >
        {selectedApp && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Offer">
              <strong>{selectedApp.offerTitle}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Application Date">
              {new Date(selectedApp.appliedAt).toLocaleString('en-US')}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <span className={getStatusClass(selectedApp.status)}>
                {getStatusTag(selectedApp.status)}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Cover Letter">
              {selectedApp.coverLetter || 'Not provided'}
            </Descriptions.Item>
            {selectedApp.cvUrl && (
              <Descriptions.Item label="CV">
                <Button 
                  type="link" 
                  icon={<FilePdfOutlined />}
                  onClick={() => window.open(`http://localhost:8080/api/postulations/fichier/${selectedApp.cvUrl}`, '_blank')}
                >
                  Download CV
                </Button>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default MyApplications;
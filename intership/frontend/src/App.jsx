import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import VisitorPage from './components/VisitorPage';
import Login from './components/Login';
import StudentSignup from './components/StudentSignup';
import RecruiterSignup from './components/RecruiterSignup';
import StudentDashboard from './components/StudentDashboard';
import RecruiterDashboard from './components/RecruiterDashboard';
import AdminDashboard from './components/AdminDashboard';
import Loading from './ui/Loading';
import RouteChangeLoader from './ui/RouteChangeLoader';

// Protected Route Component
const ProtectedRoute = ({ children, userType }) => {
  const token = localStorage.getItem('token');
  const storedUserType = localStorage.getItem('userType');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  if (userType && storedUserType !== userType) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading or check authentication
    const checkAuth = async () => {
      // Add any initial authentication checks here
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Router>
      <RouteChangeLoader>
        <div className="App">
          <Routes>
            <Route path="/" element={<VisitorPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup/student" element={<StudentSignup />} />
            <Route path="/signup/recruiter" element={<RecruiterSignup />} />
            <Route 
              path="/student/dashboard" 
              element={
                <ProtectedRoute userType="STUDENT">
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/recruiter/dashboard" 
              element={
                <ProtectedRoute userType="RECRUITER">
                  <RecruiterDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute userType="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </RouteChangeLoader>
    </Router>
  );
}

export default App;
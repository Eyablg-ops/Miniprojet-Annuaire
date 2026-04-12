import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// ── Composants Haithem (existants) ────────────────────────
import VisitorPage       from './components/VisitorPage';
import Login             from './components/Login';
import StudentSignup     from './components/StudentSignup';
import RecruiterSignup   from './components/RecruiterSignup';
import StudentDashboard  from './components/StudentDashboard';
import AdminDashboard    from './components/AdminDashboard';
import Loading           from './ui/Loading';
import RouteChangeLoader from './ui/RouteChangeLoader';


// ── Composants Personne 2 (nouveaux) ─────────────────────
import RecruiterDashboard from './components/RecruiterDashboard'; // version enrichie
import AnnuairePage       from './components/Annuairepage';       // annuaire public

// ── Route protégée ───────────────────────────────────────
const ProtectedRoute = ({ children, userType }) => {
  const token          = localStorage.getItem('token');
  const storedUserType = localStorage.getItem('userType');

  if (!token) return <Navigate to="/login" />;
  if (userType && storedUserType !== userType) return <Navigate to="/login" />;
  return children;
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  if (loading) return <Loading />;

  return (
    <Router>
      <RouteChangeLoader>
        <div className="App">
          <Routes>
            {/* ── Pages publiques ── */}
            <Route path="/"                  element={<VisitorPage />} />
            <Route path="/login"             element={<Login />} />
            <Route path="/signup/student"    element={<StudentSignup />} />
            <Route path="/signup/recruiter"  element={<RecruiterSignup />} />

            {/* ── Annuaire public (accessible sans connexion) ── */}
            <Route path="/annuaire"          element={<AnnuairePage />} />

            {/* ── Pages protégées ── */}
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
                  <RecruiterDashboard />  {/* ← version enrichie avec OffersTab + ApplicationsTab + Annuaire */}
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
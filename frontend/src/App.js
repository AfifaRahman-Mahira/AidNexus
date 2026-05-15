import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage'; 
import Login from './Login';
import Register from './Register';
import BeneficiaryDashboard from './BeneficiaryDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Ei path-ta Login.js-er navigate-er sathe match korte hobe */}
        <Route path="/beneficiary-dashboard" element={<BeneficiaryDashboard />} />

        {/* Catch-all route: Bhul path hole landing page-e nibe */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
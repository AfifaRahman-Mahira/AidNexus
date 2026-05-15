import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './AuthStyles.css'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });

      if (response.status === 200) {
        const userData = response.data.user;
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(userData));

        alert(`Login Successful! Welcome ${userData.name}`);

        // Logic check based on your console log "Role match koreni: user"
        const role = userData.role ? userData.role.toLowerCase() : '';

        if (role === 'beneficiary' || role === 'user') {
          // Ebar 'user' role thakleo dashboard-e nibe
          navigate('/beneficiary-dashboard');
        } else {
          console.log("Role mismatch. Found:", role);
          navigate('/');
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed!");
    }
  };

  return (
    <div className="auth-page-wrapper">
      <Link to="/" className="global-back-link">← Back to Home</Link>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-logo">AidNexus</h1>
            <p className="auth-subtitle">Login to Beneficiary Portal</p>
          </div>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <input 
                className="auth-input" 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="Enter email"
                required 
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                className="auth-input" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••"
                required 
              />
            </div>
            <button type="submit" className="auth-btn">Sign In</button>
          </form>
          <div className="auth-footer">
            <p>New here? <Link to="/register">Create Account</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
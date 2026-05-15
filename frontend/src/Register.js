import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './AuthStyles.css';

function Register() {
  const [name, setName] = useState('');
  const [nid, setNid] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('beneficiary');
  const [monthlyIncome, setMonthlyIncome] = useState(''); // New State for Income
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Data object with monthlyIncome
    const userData = { 
      name, 
      email, 
      password, 
      role, 
      monthlyIncome: Number(monthlyIncome), // Converting to Number
      ...(role === 'beneficiary' && { nid }) 
    };

    try {
      // Corrected URL based on your server.js
      const response = await axios.post('http://localhost:5000/api/auth/register', userData);
      
      if (response.status === 201 || response.status === 200) {
        alert("Account Created Successfully!");
        navigate('/login');
      }
    } catch (err) {
      console.error("Registration Error:", err.response?.data);
      const serverMsg = err.response?.data?.message || "Registration Failed!";
      alert(`Error: ${serverMsg}`);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <Link to="/" className="global-back-link">← Back to Home</Link>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-logo">Join Us</h1>
            <p className="auth-subtitle">Create your AidNexus account</p>
          </div>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <input className="auth-input" type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            
            <div className="form-group">
              <label>Role</label>
              <select className="auth-select" value={role} onChange={e => setRole(e.target.value)}>
                <option value="beneficiary">Beneficiary (Aid Seeker)</option>
                <option value="admin">Admin Officer</option>
              </select>
            </div>

            {role === 'beneficiary' && (
              <>
                <div className="form-group">
                  <label>NID Number</label>
                  <input className="auth-input" type="text" placeholder="10 or 17 digit NID" value={nid} onChange={e => setNid(e.target.value)} required />
                </div>
                
                {/* Monthly Income Field added here */}
                <div className="form-group">
                  <label>Monthly Income (BDT)</label>
                  <input 
                    className="auth-input" 
                    type="number" 
                    placeholder="e.g. 15000" 
                    value={monthlyIncome} 
                    onChange={e => setMonthlyIncome(e.target.value)} 
                    required 
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label>Email</label>
              <input className="auth-input" type="email" placeholder="example@mail.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input className="auth-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            <button type="submit" className="auth-btn">Register</button>
          </form>
          <div className="auth-footer">
            <p>Already joined? <Link to="/login">Login here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
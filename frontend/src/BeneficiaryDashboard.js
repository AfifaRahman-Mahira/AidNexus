import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './BeneficiaryDashboard.css'; 

function BeneficiaryDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || null;
  
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]); 
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    monthly_income: '', 
    family_size: '', 
    current_district: '', 
    aid_type: 'Cash' 
  });

  useEffect(() => {
    if (!user) { 
      navigate('/login'); 
      return; 
    }

    const fetchData = async () => {
      try {
        const userId = user._id || user.id;
        // API Calls using localhost
        const [appRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/applications/user/${userId}`)
        ]);
        
        setApplications(appRes.data);
        
        // Notifications jodi backend-e na thake, tobe error handle kora
        try {
            const notifRes = await axios.get(`http://localhost:5000/api/notifications/${userId}`);
            setNotifications(notifRes.data);
        } catch (e) {
            console.log("Notifications route not ready yet.");
        }

      } catch (err) { 
        console.error("Fetch Error:", err); 
      }
    };
    fetchData();
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // AidNexus Fraud Detection logic
    if (parseInt(formData.monthly_income) > 25000) {
      alert("⚠️ Fraud Alert: Your monthly income exceeds the eligibility limit.");
      return;
    }

    setLoading(true);
    try {
      const userId = user._id || user.id;
      
      // Exact Backend Route
      const response = await axios.post('http://localhost:5000/api/applications', {
        user_id: userId,
        monthly_income: formData.monthly_income,
        family_size: formData.family_size,
        current_district: formData.current_district,
        aid_type: formData.aid_type,
        status: 'Pending'
      });

      if (response.status === 200 || response.status === 201) {
        alert("Application submitted successfully!");
        window.location.reload(); 
      }
    } catch (err) { 
      console.error("Submit Error:", err.response?.data || err.message);
      alert("Submission failed. Ensure backend server is running."); 
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="beneficiary-dashboard-container">
      <header className="beneficiary-header">
        <h2>AidNexus Portal</h2>
        <div className="user-nav-info">
          <span>Welcome, <strong>{user.name || 'User'}</strong></span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="dashboard-main-content">
        <div className="form-card">
          <h3>Apply for Aid</h3>
          <form onSubmit={handleSubmit} className="aid-form">
            <input 
              type="number" 
              placeholder="Monthly Income" 
              value={formData.monthly_income} 
              onChange={e => setFormData({...formData, monthly_income: e.target.value})} 
              required 
            />
            <input 
              type="number" 
              placeholder="Family Size" 
              value={formData.family_size} 
              onChange={e => setFormData({...formData, family_size: e.target.value})} 
              required 
            />
            <input 
              type="text" 
              placeholder="Current District" 
              value={formData.current_district} 
              onChange={e => setFormData({...formData, current_district: e.target.value})} 
              required 
            />
            <select 
              className="form-select" 
              value={formData.aid_type} 
              onChange={e => setFormData({...formData, aid_type: e.target.value})}
            >
              <option value="Cash">Cash Assistance</option>
              <option value="Food">Food Relief</option>
              <option value="Medicine">Medical Support</option>
            </select>
            
            <button type="submit" className="submit-btn-pink" disabled={loading}>
              {loading ? 'Processing...' : 'Submit Application'}
            </button>
          </form>

          <div className="notification-panel">
            <p className="notif-header">Updates 🔔</p>
            {notifications.length > 0 ? notifications.map(n => (
              <div key={n._id} className="notif-item-style">{n.message}</div>
            )) : <p style={{fontSize: '12px', color: '#888'}}>No new notifications</p>}
          </div>
        </div>

        <div className="table-card">
          <h3>Application Status</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Token</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td>{new Date(app.createdAt || Date.now()).toLocaleDateString()}</td>
                    <td><strong>{app.aid_type}</strong></td>
                    <td>
                      <span className={`status-pill ${app.status?.toLowerCase()}`}>
                        {app.status}
                      </span>
                    </td>
                    <td>{app.status === 'Approved' ? <button className="get-token-btn">Download</button> : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BeneficiaryDashboard;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import EligibilityTracker from './EligibilityTracker'; 
import './BeneficiaryDashboard.css';

function BeneficiaryDashboard() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const user = JSON.parse(localStorage.getItem('user')) || null;
  
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]); 

  const getInitialAidType = () => {
    const passedScheme = location.state?.autoSelect;
    if (passedScheme === 'food') return 'Food';
    if (passedScheme === 'medical') return 'Medicine';
    if (passedScheme === 'cash') return 'Cash';
    return 'Cash'; 
  };

  const [formData, setFormData] = useState({
    monthly_income: '', 
    family_size: '', 
    current_district: '', 
    permanent_district: '', 
    aid_type: getInitialAidType() 
  });

  const handleQuickApply = (selectedType) => {
    setFormData(prev => ({ ...prev, aid_type: selectedType }));
    const formSection = document.querySelector('.form-card');
    if (formSection) formSection.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!user) { navigate('/login'); return; }

    const fetchData = async () => {
      try {
        // Backend-er matching ID check (id ba _id)
        const userId = user.id || user._id;
        const [appRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/applications/user/${userId}`)
        ]);
        setApplications(appRes.data);
        
        // Notifications route handle
        try {
          const notifRes = await axios.get(`http://localhost:5000/api/notifications/${userId}`);
          setNotifications(notifRes.data);
        } catch (e) { console.log("Notifications fetch failed."); }
      } catch (err) { 
        console.error("Data Fetch Error:", err); 
      }
    };
    fetchData();
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = user.id || user._id;
      // Backend Schema mismatch fix: user_id, family_size mapping
      await axios.post('http://localhost:5000/api/applications', {
        ...formData,
        user_id: userId,
        name: user.name,
        nid: user.nid || 'N/A'
      });
      alert("Application Submitted Successfully!");
      window.location.reload(); 
    } catch (err) { 
      console.error("Submission Error:", err);
      alert("Submission failed. Ensure backend server is running."); 
    }
  };

  // APNAR OLD PRINTING LOGIC (Same thaka holo)
  const handlePrintToken = (app) => {
    const voucherId = `NSDS-V-${app._id || app.id}`;
    const qrData = `Voucher ID: ${voucherId}\nName: ${user.name}\nAid: ${app.aid_type}\nStatus: ${app.status}`;
    const qrImageURL = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrData)}`;

    const WinPrint = window.open('', '', 'width=900,height=800');
    WinPrint.document.write(`
      <html>
        <head>
          <title>Voucher_${voucherId}</title>
          <style>
            body { font-family: 'Segoe UI', sans-serif; padding: 40px; display: flex; justify-content: center; }
            .voucher-wrapper { border: 3px solid #1a365d; width: 650px; padding: 0; position: relative; }
            .header { background: #1a365d; color: white; padding: 15px; text-align: center; }
            .main-body { display: flex; padding: 25px; gap: 20px; }
            .info-box { flex: 2; }
            .info-item { margin-bottom: 10px; font-size: 14px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            .qr-area { flex: 1; text-align: center; }
            .qr-area img { width: 140px; border: 1px solid #ccc; padding: 5px; }
            .seal { position: absolute; bottom: 60px; right: 30px; border: 3px solid #27ae60; color: #27ae60; padding: 5px 15px; transform: rotate(-10deg); font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="voucher-wrapper">
            <div class="header">
              <h2>Official Disbursement Token</h2>
              <p>National Social Development System (NSDS)</p>
            </div>
            <div class="main-body">
              <div class="info-box">
                <div class="info-item"><b>Voucher No:</b> ${voucherId}</div>
                <div class="info-item"><b>Beneficiary:</b> ${user.name}</div>
                <div class="info-item"><b>Support Type:</b> ${app.aid_type}</div>
                <div class="info-item"><b>District:</b> ${app.current_district}</div>
                <div class="info-item"><b>Issue Date:</b> ${new Date().toLocaleDateString()}</div>
              </div>
              <div class="qr-area">
                <img id="qr_img" src="${qrImageURL}" />
                <p style="font-size: 10px;">AUTHORIZED SCAN ONLY</p>
              </div>
            </div>
            <div class="seal">APPROVED</div>
          </div>
          <script>
            window.onload = function() { window.print(); setTimeout(() => { window.close(); }, 500); };
          </script>
        </body>
      </html>
    `);
    WinPrint.document.close();
  };

  if (!user) return null;

  return (
    <div className="beneficiary-dashboard-container">
      <nav className="beneficiary-header">
        <h2>Beneficiary Dashboard</h2>
        <div className="user-nav-info">
          <span>Welcome, <strong>{user.name}</strong></span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="dashboard-main-wrapper" style={{ padding: '20px 5%' }}>
        <div className="tracker-section">
          <EligibilityTracker onApply={handleQuickApply} />
        </div>

        <div className="dashboard-flex-content" style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
          
          <div className="form-card" style={{ flex: '1', background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: '#e91e63', marginBottom: '15px' }}>Apply for Assistance</h3>
            <form onSubmit={handleSubmit} className="aid-form">
              <input type="number" placeholder="Monthly Income" value={formData.monthly_income} onChange={e => setFormData({...formData, monthly_income: e.target.value})} required />
              <input type="number" placeholder="Family Size" value={formData.family_size} onChange={e => setFormData({...formData, family_size: e.target.value})} required />
              <input type="text" placeholder="Current District" value={formData.current_district} onChange={e => setFormData({...formData, current_district: e.target.value})} required />
              <input type="text" placeholder="Permanent District" value={formData.permanent_district} onChange={e => setFormData({...formData, permanent_district: e.target.value})} required />
              <select className="form-select" value={formData.aid_type} onChange={e => setFormData({...formData, aid_type: e.target.value})}>
                <option value="Cash">Cash Assistance</option>
                <option value="Food">Food Relief</option>
                <option value="Medicine">Medical Support</option>
              </select>
              <button type="submit" className="submit-btn-pink">Submit Application</button>
            </form>

            <div className="notification-area" style={{marginTop: '25px'}}>
              <h4>Recent Updates 🔔</h4>
              {notifications.length > 0 ? notifications.slice(0, 3).map((n) => (
                <div key={n.id} className="notif-item"> {n.message} </div>
              )) : <p style={{fontSize: '12px', color: '#999'}}>No new notifications.</p>}
            </div>
          </div>

          <div className="table-card" style={{ flex: '2', background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h3>My Applications</h3>
            <table className="beneficiary-dashboard-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                  <th style={{ padding: '12px' }}>DATE</th>
                  <th style={{ padding: '12px' }}>TYPE</th>
                  <th style={{ padding: '12px' }}>STATUS</th>
                  <th style={{ padding: '12px' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id || app.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>{new Date(app.createdAt || app.created_at || Date.now()).toLocaleDateString()}</td>
                    <td style={{ padding: '12px' }}>{app.aid_type}</td>
                    <td style={{ padding: '12px' }}>
                      <span className={`status-pill ${app.status?.toLowerCase()}`}>{app.status}</span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {app.status === 'Approved' ? (
                        <button className="get-token-btn" onClick={() => handlePrintToken(app)}>Download Token 🎫</button>
                      ) : <span style={{ fontSize: '12px', color: '#999' }}>Waiting...</span>}
                    </td>
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
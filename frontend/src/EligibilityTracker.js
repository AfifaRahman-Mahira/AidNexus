import React, { useState } from 'react';
import './EligibilityTracker.css'; // Ensure this CSS file exists

const EligibilityTracker = ({ onApply }) => {
    const [income, setIncome] = useState('');
    const [familySize, setFamilySize] = useState('');
    const [result, setResult] = useState(null);

    const checkEligibility = (e) => {
        e.preventDefault();
        const monthlyIncome = parseInt(income);
        const size = parseInt(familySize);

        // AidNexus Logic: Income < 25000 and Family Size > 2
        if (monthlyIncome <= 25000 && size >= 2) {
            setResult({
                status: 'Eligible',
                message: 'You are eligible for Food and Cash assistance!',
                color: '#27ae60',
                type: 'food'
            });
        } else if (monthlyIncome <= 35000) {
            setResult({
                status: 'Partially Eligible',
                message: 'You may qualify for Medical support.',
                color: '#f39c12',
                type: 'medical'
            });
        } else {
            setResult({
                status: 'Not Eligible',
                message: 'Your income exceeds the current subsidy limit.',
                color: '#e74c3c',
                type: 'none'
            });
        }
    };

    return (
        <div className="eligibility-card">
            <h3>Eligibility Check (AidNexus)</h3>
            <p style={{ fontSize: '13px', color: '#666' }}>Check if you qualify for social welfare subsidies.</p>
            
            <form onSubmit={checkEligibility} className="tracker-form">
                <div className="input-group-row">
                    <input 
                        type="number" 
                        placeholder="Monthly Income" 
                        value={income} 
                        onChange={(e) => setIncome(e.target.value)} 
                        required 
                    />
                    <input 
                        type="number" 
                        placeholder="Family Size" 
                        value={familySize} 
                        onChange={(e) => setFamilySize(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit" className="check-btn">Check Status</button>
            </form>

            {result && (
                <div className="result-display" style={{ borderColor: result.color }}>
                    <h4 style={{ color: result.color }}>{result.status}</h4>
                    <p>{result.message}</p>
                    {result.status !== 'Not Eligible' && (
                        <button 
                            className="quick-apply-btn" 
                            onClick={() => onApply(result.type)}
                        >
                            Apply Now
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default EligibilityTracker;
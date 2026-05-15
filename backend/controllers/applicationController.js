const Application = require('../models/Application');

// Application Submit Logic
exports.submitApplication = async (req, res) => {
    try {
        // Frontend theke asha data destructure kora
        const { user_id, monthly_income, family_size, current_district, aid_type } = req.body;

        // AidNexus Fraud Detection logic (Income limit 25k)
        if (parseInt(monthly_income) > 25000) {
            return res.status(400).json({ 
                message: "⚠️ Fraud Alert: Your monthly income exceeds the eligibility limit." 
            });
        }

        // Mapping frontend data to backend Schema fields
        // Console error onujayi 'user' ebong 'familySize' ekhane key point
        const newApplication = new Application({
            user: user_id,               // Mapping 'user_id' to 'user'
            monthly_income: monthly_income,
            familySize: family_size,      // Mapping 'family_size' to 'familySize'
            current_district: current_district,
            aid_type: aid_type,
            status: 'Pending'
        });

        // Save to Database
        await newApplication.save();
        
        res.status(201).json({ 
            message: "Application submitted successfully!", 
            data: newApplication 
        });

    } catch (err) {
        console.error("Validation Error:", err.message);
        res.status(500).json({ 
            message: "Server error during validation", 
            error: err.message 
        });
    }
};

// Fetch User Specific Applications
exports.getUserApplications = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // Mongoose query to find applications by user ID
        const apps = await Application.find({ user: userId }).sort({ createdAt: -1 });
        
        res.status(200).json(apps);
    } catch (err) {
        console.error("Fetch Error:", err.message);
        res.status(500).json({ 
            message: "Failed to fetch applications", 
            error: err.message 
        });
    }
};
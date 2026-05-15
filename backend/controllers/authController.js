const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User
exports.register = async (req, res) => {
    try {
        const { name, email, password, nid, familySize, monthlyIncome } = req.body;
        
        // 1. Check if user already exists
        let userExists = await User.findOne({ $or: [{ email }, { nid }] });
        if (userExists) return res.status(400).json({ msg: 'Email or NID already exists' });

        // 2. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create and Save User
        const newUser = new User({ 
            name, 
            email, 
            password: hashedPassword, 
            nid, 
            familySize, 
            monthlyIncome 
        });

        await newUser.save();
        res.status(201).json({ msg: 'User registered successfully!' });
    } catch (err) {
        console.error("Reg Error:", err.message);
        res.status(500).json({ error: 'Server Error: ' + err.message });
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. User check by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        // 2. Compare Password (Bcrypt check)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        // 3. Generate JWT Token
        // Make sure JWT_SECRET is in your .env file
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET || 'aidnexus_secret_key', 
            { expiresIn: '1h' }
        );

        // 4. Return Success with Full User Data for Dashboard
        res.json({ 
            token, 
            user: { 
                id: user._id, 
                name: user.name, 
                role: user.role, 
                status: user.status || 'Active',
                nid: user.nid,
                email: user.email
            } 
        });

    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ error: 'Server Error during Login' });
    }
};
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registration Logic
exports.register = async (req, res) => {
    try {
        const { name, email, password, nid, familySize, monthlyIncome } = req.body;

        // Check if user already exists (by email or NID)
        let userExists = await User.findOne({ $or: [{ email }, { nid }] });
        if (userExists) {
            return res.status(400).json({ msg: 'User with this email or NID already exists' });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create New User
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
        res.status(500).json({ error: 'Server Error: ' + err.message });
    }
};

// Login Logic
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        // Generate Token using .env secret
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, // Akhon eta .env theke nibe
            { expiresIn: '1h' }
        );

        res.json({ 
            token, 
            user: { 
                id: user._id, 
                name: user.name, 
                role: user.role,
                status: user.status 
            } 
        });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
};
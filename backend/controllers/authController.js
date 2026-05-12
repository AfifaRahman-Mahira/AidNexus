const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password, nid, familySize, monthlyIncome } = req.body;
        let userExists = await User.findOne({ $or: [{ email }, { nid }] });
        if (userExists) return res.status(400).json({ msg: 'Email or NID already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ name, email, password: hashedPassword, nid, familySize, monthlyIncome });
        await newUser.save();
        res.status(201).json({ msg: 'User registered successfully!' });
    } catch (err) {
        res.status(500).json({ error: 'Server Error: ' + err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, name: user.name, role: user.role, status: user.status } });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
};
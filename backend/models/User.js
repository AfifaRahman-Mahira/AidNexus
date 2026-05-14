const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nid: { type: String, required: true, unique: true },
    familySize: { type: Number, default: 1 },
    monthlyIncome: { type: Number, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    score: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
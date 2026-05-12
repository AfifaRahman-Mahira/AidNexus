const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    nid: { type: String, required: true },
    income: { type: Number, required: true },
    familySize: { type: Number, required: true },
    priorityScore: { type: Number, default: 0 },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    appliedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', applicationSchema);
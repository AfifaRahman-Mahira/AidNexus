require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// 1. App Initialization
const app = express();

// 2. Middleware Configuration
// CORS must be before routes to allow frontend requests
app.use(cors({
    origin: 'http://localhost:3000', // React default port
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json()); // Essential to parse JSON bodies

// 3. Database Connection Logic
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aidnexus');
        console.log('✅ AidNexus Cloud Database Connected Successfully!');
    } catch (err) {
        console.error('❌ Database Connection Failed:', err.message);
        process.exit(1);
    }
};
connectDB();

// 4. Import Routes
// Ensure these files exist in your 'routes' folder
const applicationRoutes = require('./routes/applicationRoutes');
// const authRoutes = require('./routes/authRoutes'); // Uncomment if you have auth

// 5. Route Registration
// This fixes the 'Cannot POST /api/applications' error
app.use('/api/applications', applicationRoutes);

// Root Route for testing
app.get('/', (req, res) => {
    res.send('AidNexus API is running...');
});

// 6. 404 Handler (Jodi route khuje na pay)
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// 7. Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 AidNexus Server running on port ${PORT}`);
});
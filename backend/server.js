require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Database Connection
connectDB();

// Global Middleware
app.use(cors());
app.use(express.json());

// Routes (Path corrected to lower case 'routes')
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.get('/', (req, res) => {
    res.send('AidNexus Server is running and Database is Connected!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
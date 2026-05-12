const mongoose = require('mongoose');

const connectDB = async () => {
    console.log('⏳ Connecting to MongoDB Atlas...');
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.error('❌ MONGO_URI missing!');
            return;
        }

        await mongoose.connect(uri);
        console.log('✅ AidNexus Cloud Database Connected Successfully!');
    } catch (err) {
        console.error('❌ Database Connection Error:', err.message);
        // ৫ সেকেন্ড পর আবার চেষ্টা করবে
        setTimeout(connectDB, 5000);
    }
};

module.exports = connectDB;
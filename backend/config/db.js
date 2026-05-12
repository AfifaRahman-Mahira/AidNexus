const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        await mongoose.connect(uri);
        console.log('✅ AidNexus Cloud Database Connected Successfully!');
    } catch (err) {
        console.error('❌ Database Connection Failed: ' + err.message);
        setTimeout(connectDB, 5000); // Fail hole abar try korbe
    }
};

module.exports = connectDB;
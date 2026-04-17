const mysql = require('mysql2');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '12345691', 
    database: process.env.DB_NAME || 'aid_nexus_db'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Database Connection Failed: ' + err.message);
        console.log('💡 Tip: If password fails, try leaving DB_PASSWORD empty in .env');
        return;
    }
    console.log('✅ AidNexus Database Connected Successfully!');
});

module.exports = db;
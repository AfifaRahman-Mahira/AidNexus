const express = require('express');
const router = express.Router();
// Controller theke function duto import kora (Must match the names in controller)
const { register, login } = require('../controllers/authController');

// URL: /api/auth/register
router.post('/register', register);

// URL: /api/auth/login
router.post('/login', login);

module.exports = router;
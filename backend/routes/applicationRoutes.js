const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { submitApplication } = require('../controllers/applicationController');

router.post('/apply', auth, submitApplication);

module.exports = router;
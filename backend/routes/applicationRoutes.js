const express = require('express');
const router = express.Router();
const { submitApplication, getUserApplications } = require('../controllers/applicationController');

// URL: POST http://localhost:5000/api/applications/
router.post('/', submitApplication);

// URL: GET http://localhost:5000/api/applications/user/:userId
router.get('/user/:userId', getUserApplications);

module.exports = router;
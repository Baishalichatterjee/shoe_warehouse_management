const express = require('express');
const router = express.Router();
const { getDashboardStats, getReports } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.route('/stats').get(protect, getDashboardStats);
router.route('/reports').get(protect, getReports);

module.exports = router;

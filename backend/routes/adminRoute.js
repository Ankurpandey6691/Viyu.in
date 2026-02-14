const express = require('express');
const router = express.Router();
const { assignBlock, getAdminOverview } = require('../controllers/adminController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

router.use(authenticate);

// Superadmin only
router.post('/assign-block', authorizeRoles('superadmin'), assignBlock);

// Admin only (or Superadmin)
router.get('/overview', authorizeRoles('admin', 'superadmin'), getAdminOverview);

module.exports = router;

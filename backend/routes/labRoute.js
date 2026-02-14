const express = require('express');
const router = express.Router();
const { createLab, getLabs, deleteLab } = require('../controllers/labController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

router.use(authenticate);

// Public(ish) read - Authenticated users need to see labs for selection
router.route('/').get(getLabs);

// Superadmin Only - Manage Labs
router.route('/create').post(authorizeRoles('superadmin'), createLab);
router.route('/:id').delete(authorizeRoles('superadmin'), deleteLab);

module.exports = router;

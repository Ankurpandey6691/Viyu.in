const express = require('express');
const router = express.Router();
const { createBlock, getBlocks, deleteBlock } = require('../controllers/blockController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

router.use(authenticate);

// Public(ish) read - Authenticated users need to see blocks for selection
router.route('/').get(getBlocks);

// Superadmin Only - Manage Blocks
router.route('/create').post(authorizeRoles('superadmin'), createBlock);
router.route('/:id').delete(authorizeRoles('superadmin'), deleteBlock);

module.exports = router;

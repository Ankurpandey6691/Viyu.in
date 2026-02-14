const express = require('express');
const router = express.Router();
const {
    getBlocks, createBlock, deleteBlock,
    getLabs, createLab, deleteLab
} = require('../controllers/structureController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

router.use(authenticate);

// Blocks
router.get('/blocks', getBlocks);
router.post('/blocks', authorizeRoles('superadmin'), createBlock);
router.delete('/blocks/:id', authorizeRoles('superadmin'), deleteBlock);

// Labs
router.get('/labs', getLabs);
router.post('/labs', authorizeRoles('superadmin'), createLab);
router.delete('/labs/:id', authorizeRoles('superadmin'), deleteLab);

module.exports = router;

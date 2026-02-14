const express = require('express');
const router = express.Router();
const { getBlocks, getLabs } = require('../controllers/structureController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/blocks', getBlocks);
router.get('/labs', getLabs);

module.exports = router;

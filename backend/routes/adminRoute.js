const express = require('express');
const router = express.Router();
const { getAdminOverview, getAdminLabs, getAdminFaculty, updateFaculty } = require('../controllers/adminController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

router.use(authenticate);
router.use(authorizeRoles('admin'));

router.get('/overview', getAdminOverview);
router.get('/labs', getAdminLabs);
router.get('/faculty', getAdminFaculty);
router.put('/faculty/:id', updateFaculty);

module.exports = router;

const express = require('express');
const router = express.Router();
const { createUser, getUsers, updateUser, assignUserScope, resetPassword } = require('../controllers/userController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

// Protected Routes
router.use(authenticate);

// Superadmin & Admin - User Creation (Controller handles specific restrictions)
router.route('/create').post(authorizeRoles('superadmin', 'admin'), createUser);
router.route('/:id/assign-scope').put(authorizeRoles('superadmin'), assignUserScope);
router.route('/:id/reset-password').post(authorizeRoles('superadmin'), resetPassword);

// Admin & Superadmin - User Management
router.use(authorizeRoles('superadmin', 'admin'));
router.route('/').get(getUsers);
router.route('/:id').put(updateUser);

module.exports = router;

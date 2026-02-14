const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const Resource = require('../models/Resource');

// @desc    Get all resources
// @route   GET /api/resources
// @access  Private (Authenticated)
router.get('/', authenticate, async (req, res) => {
    try {
        const resources = await Resource.find({});
        res.json(resources);
    } catch (err) {
        console.error('Error fetching resources:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;

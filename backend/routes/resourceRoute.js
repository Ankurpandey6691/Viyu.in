const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const Lab = require('../models/Lab');
const Resource = require('../models/Resource');

// @desc    Get all resources
// @route   GET /api/resources
// @access  Private (Authenticated)
router.get('/', authenticate, async (req, res) => {
    try {
        const { role, assignedLabs, assignedBlocks } = req.user;
        let query = {};

        if (role === 'superadmin' || role === 'admin') {
            query = {};
        } else {
            const mongoose = require('mongoose');
            // Split assignedLabs into Names and IDs to avoid CastError
            const names = (assignedLabs || []).filter(l => !mongoose.Types.ObjectId.isValid(l));
            const ids = (assignedLabs || []).filter(l => mongoose.Types.ObjectId.isValid(l));

            // Step 1: Find the IDs of the labs the user is allowed to see
            const allowedLabs = await Lab.find({
                $or: [
                    { name: { $in: names } },
                    { _id: { $in: ids } },
                    { block: { $in: assignedBlocks || [] } }
                ]
            }).select('_id name');

            const allowedLabIds = allowedLabs.map(l => l._id);

            // Step 2: Filter resources where 'lab' matches these IDs
            query = {
                lab: { $in: allowedLabIds }
            };
        }

        const resources = await Resource.find(query).populate('lab');

        res.json(resources);
    } catch (err) {
        console.error('Error fetching resources:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;

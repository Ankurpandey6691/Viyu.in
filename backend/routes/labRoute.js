
const express = require('express');
const router = express.Router();
const Lab = require('../models/Lab');
const { authenticate } = require('../middleware/authMiddleware');

// Get all labs (Filtered by User Access)
router.get('/', authenticate, async (req, res) => {
    try {
        const { role, assignedLabs, assignedBlocks } = req.user;
        let query = {};
        const mongoose = require('mongoose');

        // Superadmin/Admin sees all
        if (role === 'superadmin' || role === 'admin') {
            query = {};
        } else {
            // Split assignedLabs into Names and IDs to avoid CastError
            const names = (assignedLabs || []).filter(l => !mongoose.Types.ObjectId.isValid(l));
            const ids = (assignedLabs || []).filter(l => mongoose.Types.ObjectId.isValid(l));

            // Restricted users: Match Name OR ID OR Block
            query = {
                $or: [
                    { name: { $in: names } },
                    { _id: { $in: ids } },
                    { block: { $in: assignedBlocks || [] } }
                ]
            };
        }

        const labs = await Lab.find(query);
        res.json(labs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// Toggle Session
router.post('/toggle-session', async (req, res) => {
    const { labCode } = req.body;
    const io = req.io;

    try {
        const lab = await Lab.findOne({ code: labCode });
        if (!lab) {
            return res.status(404).json({ message: 'Lab not found' });
        }

        lab.isSessionActive = !lab.isSessionActive;
        await lab.save();

        if (io) {
            io.emit('lab_session_update', {
                labCode: lab.code,
                isSessionActive: lab.isSessionActive
            });
        }

        res.json(lab);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

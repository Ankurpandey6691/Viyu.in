const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');

// Middleware to verify device token
const verifyDeviceToken = (req, res, next) => {
    const token = req.headers['x-device-token'];
    if (!token || token !== process.env.DEVICE_SECRET) {
        return res.status(403).json({ error: 'Unauthorized: Invalid Device Token' });
    }
    next();
};

router.post('/', verifyDeviceToken, async (req, res) => {
    const { deviceId, roomNo, type } = req.body;
    const io = req.io;
    const redisClient = req.redisClient;

    if (!deviceId) {
        return res.status(400).json({ error: 'Device ID is required' });
    }

    try {
        // 1. Redis Sync (The "Magic")
        // Key: device:<deviceId>:status
        // Value: Online
        // Expiry: 65 seconds (slightly more than 2x heartbeat interval of 30s)
        const redisKey = `device:${deviceId}:status`;
        await redisClient.set(redisKey, 'Online', {
            EX: 65
        });

        // 2. Real-time Broadcast
        if (io) {
            io.emit('status_update', {
                deviceId,
                status: 'Online',
                roomNo, // Optional: send extra data if needed
                timestamp: Date.now()
            });
        }

        // 3. Database Async Update (Fire and Forget)
        // Upsert: Create if not exists, update lastSeen if exists
        Resource.findOneAndUpdate(
            { deviceId },
            {
                $set: {
                    status: 'Online',
                    lastSeen: new Date(),
                    roomNo: roomNo || 'Unknown', // Update roomNo if provided
                    type: type || 'PC'
                }
            },
            { upsert: true, new: true }
        ).exec(); // Execute without awaiting to keep response fast

        res.status(200).json({ status: 'Heartbeat received' });

    } catch (error) {
        console.error('Heartbeat Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

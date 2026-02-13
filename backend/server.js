require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const { createClient } = require('redis');
const authRoute = require("./routes/authRoute");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all for MVP, restrict in prod
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);

// Redis Client
const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

// Connect to Redis and MongoDB
(async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');

        // Configure Redis Keyspace Notifications for Expiry events
        // 'Ex' means Keyevent (E) and Expired (x) events
        await redisClient.configSet('notify-keyspace-events', 'Ex');
        console.log('Redis Keyspace Notifications Configured');

        // Subscriber for Expiry Events
        const subscriber = redisClient.duplicate();
        await subscriber.connect();

        await subscriber.subscribe('__keyevent@0__:expired', (message) => {
            console.log('Expired Key:', message);
            // Expected format: device:LAB1-PC01:status
            if (message.includes(':status')) {
                const parts = message.split(':');
                if (parts.length >= 2) {
                    const deviceId = parts[1]; // Adjust based on key format
                    // Determine deviceId from the key
                    // Key format: device:<deviceId>:status
                    // message is the key name.
                    // e.g., device:LAB1-PC01:status

                    const DeviceIdFromKey = message.split(':')[1];

                    console.log(`Device ${DeviceIdFromKey} went offline (Redis Key Expired)`);

                    // Broadcast Offline Status
                    io.emit('status_update', { deviceId: DeviceIdFromKey, status: 'Offline' });

                    // TODO: Update MongoDB status to 'Offline' asynchronously
                    // updateDeviceStatusInDB(DeviceIdFromKey, 'Offline');
                }
            }
        });

    } catch (err) {
        console.error('Redis Connection Error:', err);
    }
})();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/viyu', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
const heartbeatRoute = require('./routes/heartbeat');
app.use('/api/heartbeat', (req, res, next) => {
    req.io = io; // Inject io instance
    req.redisClient = redisClient; // Inject redis client
    next();
}, heartbeatRoute);

// Basic Route
app.get('/', (req, res) => {
    res.send('Viyu.in Backend is Live');
});

// Socket.io Connection
io.on('connection', (socket) => {
    console.log('New Client Connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('Client Disconnected:', socket.id);
    });
});

// Resources Endpoint
app.get('/api/resources', async (req, res) => {
    try {
        const Resource = require('./models/Resource');
        const resources = await Resource.find({});
        res.json(resources);
    } catch (err) {
        console.error('Error fetching resources:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    // Zombie PC Handling on Startup
    const Resource = require('./models/Resource');

    const syncZombiePCs = async () => {
        try {
            console.log('Running Zombie PC Cleanup...');
            const resources = await Resource.find({});

            for (const resource of resources) {
                const redisKey = `device:${resource.deviceId}:status`;
                const status = await redisClient.get(redisKey);

                if (!status && resource.status === 'Online') {
                    console.log(`Marking Zombie PC detected: ${resource.deviceId} as Offline`);

                    // Update DB
                    resource.status = 'Offline';
                    await resource.save();

                    // Broadcast update
                    io.emit('status_update', { deviceId: resource.deviceId, status: 'Offline' });
                }
            }
            console.log('Zombie PC Cleanup Complete');
        } catch (err) {
            console.error('Zombie Cleanup Error:', err);
        }
    };

    // Run initial sync
    syncZombiePCs();
});

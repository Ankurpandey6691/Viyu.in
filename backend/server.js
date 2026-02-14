require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const { createClient } = require('redis');
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");

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
app.use("/api/auth", require("./routes/authRoute")); // Re-added authRoute as it's essential
app.use('/api/users', require('./routes/userRoute'));
app.use('/api/resources', require('./routes/resourceRoute'));
app.use('/api/structure', require('./routes/structureRoute')); // Dynamic Structure
app.use('/api/admin', require('./routes/adminRoute')); // Admin Operational System

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
const si = require('systeminformation');

io.on('connection', (socket) => {
    console.log('New Client Connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('Client Disconnected:', socket.id);
    });
});

// Broadcast System Stats every 5 seconds
setInterval(async () => {
    try {
        const networkStats = await si.networkStats();
        // networkStats is an array of interfaces. We generally want the active one.
        // For simplicity, we'll sum up rx/tx of all interfaces or pick the first active one.
        // For now, let's just send the first non-internal one.

        const activeInterface = networkStats.find(iface => !iface.internal && iface.operstate === 'up') || networkStats[0];

        if (activeInterface) {
            io.emit('system_stats', {
                rx_sec: activeInterface.rx_sec, // bytes per second
                tx_sec: activeInterface.tx_sec,
                iface: activeInterface.iface
            });
        }
    } catch (e) {
        console.error('Error fetching system stats:', e);
    }
}, 5000);

const { authenticate, authorizeScope, authorizeRoles } = require('./middleware/authMiddleware');

const labRoutes = require('./routes/labRoute');

// Inject io into request for lab routes
app.use('/api/labs', (req, res, next) => {
    req.io = io;
    next();
}, labRoutes);

// Resources Endpoint
// Protected: Only authenticated users. 
// Scope check could be applied if we had :block/:lab params, but for now just general access control or block-based if we filter.
// For the test "Faculty accessing other faculty's lab", we need a scoped route.
// Let's modify this to accept query params for scope check or just rely on the test script to hit a scoped-like endpoint.
// Actually, to test "Faculty trying to access another faculty's lab", we need a route that invokes `authorizeScope`.
// `authorizeScope` checks `req.params.block` or `req.body.block`.
// Let's create a specific scoped resource route for testing/usage.

app.get('/api/resources/:block/:lab', authenticate, authorizeScope, async (req, res) => {
    try {
        const { block, lab } = req.params;
        // In a real app, we'd filter by block/lab. 
        // For now, just return success to prove access was granted.
        res.json({ message: `Access granted to ${block} / ${lab}` });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// Original resources route - Protected
app.get('/api/resources', authenticate, async (req, res) => {
    try {
        const Resource = require('./models/Resource');
        const Lab = require('./models/Lab');
        const { role, assignedLabs, assignedBlocks } = req.user;
        let query = {};


        // Step 1: Find the IDs of the labs the user is allowed to see
        // Match Name matches assignedLabs OR Block matches assignedBlocks
        console.log(`[DEBUG] Filtering resources for user: ${req.user.email} (${role})`);
        console.log(`[DEBUG] Assigned Labs:`, assignedLabs);
        console.log(`[DEBUG] Assigned Blocks:`, assignedBlocks);

        const allowedLabs = await Lab.find({
            $or: [
                { name: { $in: assignedLabs || [] } },
                { block: { $in: assignedBlocks || [] } }
            ]
        }).select('_id name');

        console.log(`[DEBUG] Allowed Labs found: ${allowedLabs.length}`);
        allowedLabs.forEach(l => console.log(` - ${l.name} (${l._id})`));

        const allowedLabIds = allowedLabs.map(l => l._id);

        // Step 2: Filter resources where 'lab' matches these IDs
        query = {
            lab: { $in: allowedLabIds }
        };
        console.log(`[DEBUG] Resource Query:`, JSON.stringify(query));
        const resources = await Resource.find(query).populate('lab');
        console.log(`[DEBUG] Resources found: ${resources.length}`);
        if (resources.length > 0) {
            console.log(`[DEBUG] Sample Resource Lab:`, JSON.stringify(resources[0].lab));
        }
        res.json(resources);
    } catch (err) {
        console.error('Error fetching resources:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// Dummy Attendance Route for RBAC Verification
// Requirement: "Maintenance trying to hit attendance route" -> Should be denied.
// Only Superadmin, Admin, and maybe Faculty (for their own) should access.
app.get('/api/attendance', authenticate, authorizeRoles('superadmin', 'admin', 'faculty'), (req, res) => {
    res.json({ message: "Attendance data" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    // Zombie PC Handling on Startup
    const Resource = require('./models/Resource');

    const syncZombiePCs = async () => {
        try {
            console.log('Running Zombie PC Cleanup...');
            // Wait for Redis to be ready if needed, but client buffers commands
            if (!redisClient.isOpen) {
                console.log('Waiting for Redis to open...');
                // Simple wait or check
            }

            const resources = await Resource.find({});

            for (const resource of resources) {
                const redisKey = `device:${resource.deviceId}:status`;
                // If redis is not ready, this might throw or wait. 
                // Since we start server.listen immediately, we might race.
                // However, the redis client queues commands.
                try {
                    const status = await redisClient.get(redisKey);
                    if (!status && resource.status === 'Online') {
                        console.log(`Marking Zombie PC detected: ${resource.deviceId} as Offline`);
                        resource.status = 'Offline';
                        await resource.save();
                        io.emit('status_update', { deviceId: resource.deviceId, status: 'Offline' });
                    }
                } catch (e) {
                    console.error(`Error checking zombie status for ${resource.deviceId}:`, e.message);
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

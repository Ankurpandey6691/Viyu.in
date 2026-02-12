const axios = require('axios');
const { createClient } = require('redis');
const { io } = require('socket.io-client');
const mongoose = require('mongoose');
const Resource = require('./models/Resource');
require('dotenv').config();

const SERVER_URL = 'http://localhost:5000';
const DEVICE_ID = 'TEST-PC-01';
const TOKEN = process.env.DEVICE_SECRET;

async function runVerification() {
    console.log('--- Starting Day 1 Verification ---');

    // 1. Setup Redis Client to check keys
    const redisClient = createClient({ url: process.env.REDIS_URL });
    await redisClient.connect();

    // 2. Setup Socket.io Client
    const socket = io(SERVER_URL);

    let socketReceived = false;
    socket.on('status_update', (data) => {
        if (data.deviceId === DEVICE_ID && data.status === 'Online') {
            console.log('✅ Socket.io: Received Status Update (Online)');
            socketReceived = true;
        }
    });

    // 3. Send Heartbeat
    try {
        console.log(`Sending Heartbeat for ${DEVICE_ID}...`);
        const response = await axios.post(`${SERVER_URL}/api/heartbeat`, {
            deviceId: DEVICE_ID,
            roomNo: '101',
            type: 'PC'
        }, {
            headers: { 'x-device-token': TOKEN }
        });

        if (response.status === 200) {
            console.log('✅ API: Heartbeat Response 200 OK');
        } else {
            console.error('❌ API: Failed with status', response.status);
        }

    } catch (error) {
        console.error('❌ API: Error sending heartbeat', error.message);
    }

    // 4. Verify Redis Key
    const redisKey = `device:${DEVICE_ID}:status`;
    const redisValue = await redisClient.get(redisKey);
    const ttl = await redisClient.ttl(redisKey);

    if (redisValue === 'Online') {
        console.log('✅ Redis: Key exists and value is "Online"');
    } else {
        console.error('❌ Redis: Key missing or wrong value:', redisValue);
    }

    if (ttl > 0 && ttl <= 65) {
        console.log(`✅ Redis: TTL is valid (${ttl}s)`);
    } else {
        console.error('❌ Redis: TTL invalid:', ttl);
    }

    // 5. Verify MongoDB (Directly)
    await mongoose.connect(process.env.MONGO_URI);
    const resource = await Resource.findOne({ deviceId: DEVICE_ID });

    if (resource && resource.status === 'Online') {
        console.log('✅ MongoDB: Resource updated and status is "Online"');
    } else {
        console.error('❌ MongoDB: Resource missing or status incorrect');
    }

    // Wait a bit for socket event
    setTimeout(() => {
        if (!socketReceived) {
            console.error('❌ Socket.io: Did not receive update in time');
        }

        console.log('--- Verification Complete ---');
        process.exit(0);
    }, 2000);
}

runVerification();

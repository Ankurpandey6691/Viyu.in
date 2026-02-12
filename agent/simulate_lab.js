const axios = require('axios');
require('dotenv').config();

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';
const DEVICE_SECRET = process.env.DEVICE_SECRET;
const LAB_PREFIX = 'LAB1-PC';
const AGENT_COUNT = 5; // Simulating 5 PCs

console.log(`--- Starting Lab Simulator: ${AGENT_COUNT} Agents ---`);

const sendPing = async (id) => {
    try {
        await axios.post(`${SERVER_URL}/api/heartbeat`, {
            deviceId: `${LAB_PREFIX}${id.toString().padStart(2, '0')}`,
            roomNo: '101',
            type: 'PC'
        }, {
            headers: { 'x-device-token': DEVICE_SECRET }
        });
        // process.stdout.write('.'); // Minimal output
    } catch (error) {
        process.stdout.write('x');
    }
};

// Loop for all agents
setInterval(() => {
    process.stdout.write(`\nSending Batch Pings (${new Date().toLocaleTimeString()}): `);
    for (let i = 1; i <= AGENT_COUNT; i++) {
        sendPing(i);
        process.stdout.write(`${i} `);
    }
}, 5000); // Fast ping (5s) for simulation

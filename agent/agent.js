require('dotenv').config();
const axios = require('axios');

// Configuration
const DEVICE_ID = process.env.DEVICE_ID || 'UNKNOWN-DEVICE';
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';
const DEVICE_SECRET = process.env.DEVICE_SECRET;
const INTERVAL = parseInt(process.env.HEARTBEAT_INTERVAL) || 30000;

console.log(`Starting Agent for Device: ${DEVICE_ID}`);
console.log(`Target Server: ${SERVER_URL}`);

// Heartbeat Function
const sendHeartbeat = async () => {
    try {
        // Generate dynamic metrics for simulation
        const metrics = {
            cpu: Math.floor(Math.random() * 80 + 10) + '%', // 10-90%
            ram: (Math.random() * 4 + 4).toFixed(1) + ' GB', // 4.0-8.0 GB
            temp: Math.floor(Math.random() * 40 + 35) + '°C' // 35-75°C
        };

        const payload = {
            deviceId: DEVICE_ID,
            roomNo: 'LAB-1', // Start with hardcoded, can be config later
            type: 'PC',
            metrics: metrics
        };

        const config = {
            headers: {
                'x-device-token': DEVICE_SECRET
            },
            timeout: 5000 // 5s timeout to avoid hanging
        };

        const response = await axios.post(`${SERVER_URL}/api/heartbeat`, payload, config);

        if (response.status === 200) {
            console.log(`[${new Date().toISOString()}] ❤ Heartbeat Sent successfully`);
        } else {
            console.warn(`[${new Date().toISOString()}] ⚠ Server responded with status: ${response.status}`);
        }

    } catch (error) {
        // Robust Error Handling (Log but don't crash)
        if (error.code === 'ECONNREFUSED') {
            console.error(`[${new Date().toISOString()}] ❌ Connection Refused. Is the server running?`);
        } else if (error.response) {
            // Server responded with a status code outside of 2xx
            console.error(`[${new Date().toISOString()}] ❌ Server Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        } else {
            console.error(`[${new Date().toISOString()}] ❌ Heartbeat Failed: ${error.message}`);
        }
    }
};

// Initial Ping
sendHeartbeat();

// Schedule Loop
setInterval(sendHeartbeat, INTERVAL);

// Keep process alive handled by setInterval

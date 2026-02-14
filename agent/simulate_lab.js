const axios = require('axios');
require('dotenv').config();

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';
const DEVICE_SECRET = process.env.DEVICE_SECRET;

// Simulation Config
// We will pick a few labs to simulate activity for
const ACTIVE_LABS = [
    { prefix: 'CSE-DS', count: 20, room: 'Data Structures Lab' }, // Increased from 10
    { prefix: 'IT-WEB', count: 15, room: 'Web Development Lab' }, // Increased from 8
    { prefix: 'MBA-CL', count: 10, room: 'Computer Lab' },
    { prefix: 'ARCH-DS1', count: 5, room: 'Design Studio 1' }
];

console.log(`--- Starting SVVV Lab Simulator ---`);

const sendPing = async (deviceId, roomNo, metrics) => {
    try {
        await axios.post(`${SERVER_URL}/api/heartbeat`, {
            deviceId: deviceId,
            roomNo: roomNo,
            type: 'PC',
            metrics: metrics
        }, {
            headers: { 'x-device-token': DEVICE_SECRET }
        });
    } catch (error) {
        console.error(`Error pinging ${deviceId}:`, error.message);
        if (error.response) {
            console.error('Status:', error.response.status, 'Data:', error.response.data);
        }
    }
};

setInterval(() => {
    process.stdout.write(`\nSending Batch Pings (${new Date().toLocaleTimeString()}): `);

    let totalPings = 0;

    ACTIVE_LABS.forEach(lab => {
        for (let i = 1; i <= lab.count; i++) {
            const deviceId = `${lab.prefix}-${i.toString().padStart(2, '0')}`;
            const metrics = {
                cpu: Math.floor(Math.random() * 80 + 10) + '%', // 10-90%
                ram: (Math.random() * 4 + 4).toFixed(1) + ' GB', // 4.0-8.0 GB
                temp: Math.floor(Math.random() * 40 + 35) + '°C' // 35-75°C
            };
            sendPing(deviceId, lab.room, metrics);
            totalPings++;
        }
    });

    process.stdout.write(`${totalPings} devices polled.`);
}, 20000); 

const axios = require('axios');
require('dotenv').config();

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';
const DEVICE_SECRET = process.env.DEVICE_SECRET;

// Simulation Config
// We will pick a few labs to simulate activity for
const ACTIVE_LABS = [
    { prefix: 'CSE-DS', count: 10, room: 'Data Structures Lab' },
    { prefix: 'IT-WEB', count: 8, room: 'Web Development Lab' },
    { prefix: 'MBA-CL', count: 5, room: 'Computer Lab' },
    { prefix: 'ARCH-DS1', count: 3, room: 'Design Studio 1' }
];

console.log(`--- Starting SVVV Lab Simulator ---`);

const sendPing = async (deviceId, roomNo) => {
    try {
        await axios.post(`${SERVER_URL}/api/heartbeat`, {
            deviceId: deviceId,
            roomNo: roomNo,
            type: 'PC'
        }, {
            headers: { 'x-device-token': DEVICE_SECRET }
        });
    } catch (error) {
        // process.stdout.write('x');
    }
};

setInterval(() => {
    process.stdout.write(`\nSending Batch Pings (${new Date().toLocaleTimeString()}): `);

    let totalPings = 0;

    ACTIVE_LABS.forEach(lab => {
        for (let i = 1; i <= lab.count; i++) {
            const deviceId = `${lab.prefix}-${i.toString().padStart(2, '0')}`;
            sendPing(deviceId, lab.room);
            totalPings++;
        }
    });

    process.stdout.write(`${totalPings} devices polled.`);
}, 5000);

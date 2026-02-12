const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    deviceId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    roomNo: {
        type: String,
        required: true
    },
    block: {
        type: String,
        default: 'Main Block',
        index: true
    },
    department: {
        type: String,
        default: 'General',
        index: true
    },
    lab: {
        type: String,
        default: 'General Lab',
        index: true
    },
    type: {
        type: String,
        enum: ['PC', 'Projector'],
        default: 'PC'
    },
    status: {
        type: String,
        enum: ['Online', 'Offline'],
        default: 'Offline'
    },
    lastSeen: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Resource', ResourceSchema);

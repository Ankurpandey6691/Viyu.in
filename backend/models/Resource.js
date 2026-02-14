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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lab',
        required: true,
        index: true
    },
    labCode: {
        type: String,
        index: true
    },
    type: {
        type: String,
        enum: ['PC', 'Projector'],
        default: 'PC'
    },
    lastSeen: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Resource', ResourceSchema);

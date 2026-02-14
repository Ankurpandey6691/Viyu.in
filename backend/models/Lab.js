
const mongoose = require('mongoose');

const LabSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    department: {
        type: String,
        required: true
    },
    block: {
        type: String,
        required: true
    },
    isSessionActive: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Lab', LabSchema);

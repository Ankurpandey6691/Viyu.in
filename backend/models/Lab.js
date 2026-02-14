const mongoose = require("mongoose");

const labSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    block: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Block',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Enforce unique lab names PER BLOCK
labSchema.index({ name: 1, block: 1 }, { unique: true });

module.exports = mongoose.model("Lab", labSchema);

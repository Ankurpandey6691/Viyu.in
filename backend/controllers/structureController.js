const Resource = require("../models/Resource");

// @desc    Get all unique Blocks
// @route   GET /api/structure/blocks
// @access  Private (Authenticated)
const getBlocks = async (req, res) => {
    try {
        // Distinct "block" field from Resource collection
        const blocks = await Resource.distinct("block");
        res.json(blocks.filter(b => b)); // Filter out null/undefined
    } catch (error) {
        console.error("Get Blocks Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get Labs for a specific Block
// @route   GET /api/structure/labs
// @access  Private (Authenticated)
const getLabs = async (req, res) => {
    try {
        const { block } = req.query;
        let query = {};

        if (block) {
            query.block = block;
        }

        // Distinct "lab" field, optionally filtered by block
        const labs = await Resource.find(query).distinct("lab");
        res.json(labs.filter(l => l));
    } catch (error) {
        console.error("Get Labs Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    getBlocks,
    getLabs
};

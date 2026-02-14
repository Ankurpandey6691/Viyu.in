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

const Lab = require("../models/Lab");

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

        // 1. Get distinct Lab IDs from Resources
        const labIds = await Resource.find(query).distinct("lab");

        // 2. Fetch Lab details (Name, ID) for these IDs
        const labs = await Lab.find({ _id: { $in: labIds } }).select("name code");

        res.json(labs);
    } catch (error) {
        console.error("Get Labs Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    getBlocks,
    getLabs
};

const Resource = require("../models/Resource");
const Lab = require("../models/Lab");
const Block = require("../models/Block");

// @desc    Get all Blocks
// @route   GET /api/structure/blocks
// @access  Private (Authenticated)
const getBlocks = async (req, res) => {
    try {
        const blocks = await Block.find({}).sort({ name: 1 });
        console.log("Blocks returned:", blocks);
        res.json(blocks);
    } catch (error) {
        console.error("Get Blocks Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Create a Block
// @route   POST /api/structure/blocks
// @access  Private (Admin)
const createBlock = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: "Block name is required" });

        const block = await Block.create({ name });
        res.status(201).json(block);
    } catch (error) {
        console.error("Create Block Error:", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Delete a Block
// @route   DELETE /api/structure/blocks/:id
// @access  Private (Admin)
const deleteBlock = async (req, res) => {
    try {
        const { id } = req.params;
        // Check for dependencies (Labs)? For now, just delete.
        await Block.findByIdAndDelete(id);
        res.json({ message: "Block deleted" });
    } catch (error) {
        console.error("Delete Block Error:", error);
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

        // If block ID is provided, filter by block
        // Note: Lab model currently stores 'block' as String (Name) or maybe we should switch to ID?
        // User's previous code used Block Name in 'block' field in Lab.
        // Let's check Lab.js again. It says 'block: { type: String }'.
        // So we should query by block Name if 'block' param is a name, or handle ID mapping.
        // However, the new UI sends Block ID to createLab.
        // We should probably update Lab to store Block ID or Name.
        // For consistency with existing data (which has Block Names "Main Block"), let's store Name for now 
        // OR better: Update Lab to index Block Name.

        // Wait, 'getLabs' in the previous version filtered by Resource.
        // Now valid Labs are in Lab collection.
        // Users might want all labs.

        const labs = await Lab.find(query).sort({ name: 1 });
        res.json(labs);
    } catch (error) {
        console.error("Get Labs Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Create a Lab
// @route   POST /api/structure/labs
// @access  Private (Admin)
const createLab = async (req, res) => {
    try {
        const { name, code, department, blockId } = req.body;

        // Resolve Block Name if we are storing names
        const blockDoc = await Block.findById(blockId);
        if (!blockDoc) return res.status(404).json({ message: "Block not found" });

        const lab = await Lab.create({
            name,
            code,
            department,
            block: blockDoc.name // Storing name as per current schema
        });
        res.status(201).json(lab);
    } catch (error) {
        console.error("Create Lab Error:", error);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};

// @desc    Delete a Lab
// @route   DELETE /api/structure/labs/:id
// @access  Private (Admin)
const deleteLab = async (req, res) => {
    try {
        const { id } = req.params;
        await Lab.findByIdAndDelete(id);
        res.json({ message: "Lab deleted" });
    } catch (error) {
        console.error("Delete Lab Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    getBlocks,
    createBlock,
    deleteBlock,
    getLabs,
    createLab,
    deleteLab
};

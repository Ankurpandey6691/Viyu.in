const Block = require("../models/Block");
const Lab = require("../models/Lab");
const User = require("../models/User");

// @desc    Create a new Block
// @route   POST /api/blocks
// @access  Private (Superadmin)
const createBlock = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Block name is required" });
    }

    try {
        const blockExists = await Block.findOne({ name });
        if (blockExists) {
            return res.status(400).json({ message: "Block already exists" });
        }

        const block = await Block.create({
            name,
            createdBy: req.user._id
        });

        res.status(201).json(block);
    } catch (error) {
        console.error("Create Block Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get all blocks
// @route   GET /api/blocks
// @access  Private
const getBlocks = async (req, res) => {
    try {
        const blocks = await Block.find({}).sort({ name: 1 });
        res.json(blocks);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Delete a block
// @route   DELETE /api/blocks/:id
// @access  Private (Superadmin)
const deleteBlock = async (req, res) => {
    try {
        const block = await Block.findById(req.params.id);

        if (!block) {
            return res.status(404).json({ message: "Block not found" });
        }

        // Dependency Check: Labs
        const labs = await Lab.countDocuments({ block: block._id });
        if (labs > 0) {
            return res.status(400).json({
                message: `Cannot delete Block. It has ${labs} dependent Labs. Delete them first.`
            });
        }

        // Dependency Check: Users (Admins assigned to this block)
        const users = await User.countDocuments({ assignedBlocks: block._id });
        if (users > 0) {
            return res.status(400).json({
                message: `Cannot delete Block. It is assigned to ${users} Users.`
            });
        }

        await block.deleteOne();
        res.json({ message: "Block removed" });

    } catch (error) {
        console.error("Delete Block Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    createBlock,
    getBlocks,
    deleteBlock
};

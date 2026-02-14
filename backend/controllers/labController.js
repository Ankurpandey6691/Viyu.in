const Lab = require("../models/Lab");
const Block = require("../models/Block");
const User = require("../models/User");

// @desc    Create a new Lab
// @route   POST /api/labs
// @access  Private (Superadmin)
const createLab = async (req, res) => {
    const { name, blockId } = req.body;

    if (!name || !blockId) {
        return res.status(400).json({ message: "Lab name and Block ID are required" });
    }

    try {
        const block = await Block.findById(blockId);
        if (!block) {
            return res.status(404).json({ message: "Block not found" });
        }

        // Check for duplicate lab name IN THIS BLOCK
        const labExists = await Lab.findOne({ name, block: blockId });
        if (labExists) {
            return res.status(400).json({ message: "Lab with this name already exists in the selected block" });
        }

        const lab = await Lab.create({
            name,
            block: blockId,
            createdBy: req.user._id
        });

        const populatedLab = await Lab.findById(lab._id).populate('block', 'name');
        res.status(201).json(populatedLab);

    } catch (error) {
        console.error("Create Lab Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get all labs (optionally filtered by blockId)
// @route   GET /api/labs
// @access  Private
const getLabs = async (req, res) => {
    try {
        const query = {};
        if (req.query.blockId) {
            query.block = req.query.blockId;
        }

        const labs = await Lab.find(query).populate('block', 'name').sort({ name: 1 });
        res.json(labs);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Delete a lab
// @route   DELETE /api/labs/:id
// @access  Private (Superadmin)
const deleteLab = async (req, res) => {
    try {
        const lab = await Lab.findById(req.params.id);

        if (!lab) {
            return res.status(404).json({ message: "Lab not found" });
        }

        // Dependency Check: Users (Faculty assigned to this lab)
        const users = await User.countDocuments({ assignedLabs: lab._id });
        if (users > 0) {
            return res.status(400).json({
                message: `Cannot delete Lab. It is assigned to ${users} Faculty members.`
            });
        }

        await lab.deleteOne();
        res.json({ message: "Lab removed" });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    createLab,
    getLabs,
    deleteLab
};
